import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getPromptStyle, getTierLabel, getLimit, pickHighestTier, getUserTierAndUsage, type Tier } from '@/lib/tiers';
import { generateImage } from '@/lib/image-generation';
import { formatDiagnosticReportForChat } from '@/lib/diagnostics';

// =============================================
// TIER-AWARE SYSTEM PROMPT (now uses centralized tier config)
// =============================================
function getMyTechFixSystemPrompt(tier: string): string {
  const style = getPromptStyle(tier);
  const label = getTierLabel(tier);

  const basePrompt = `You are MyTech-Fix, a helpful and practical AI assistant that specializes in tech troubleshooting, device setup, everyday IT guidance for home users and small businesses (including general awareness advice for cybersecurity events when asked).

Your personality is friendly, clear, and patient. You explain things simply without being condescending.

### Core Rules (Apply to ALL tiers)
- Always try to be helpful. Never refuse to answer a question outright.
- Focus on practical, actionable advice for troubleshooting, basic setup, common how-to tasks, and productivity.
- You are especially strong at IoT/smart home troubleshooting, WiFi issues, computer problems, printers, and basic device connectivity.
- Cybersecurity guidance is available but **only** provide it (and the required disclaimer) when the user specifically asks about cyber threats, incidents, or security events. Do not bring it up unprompted.
- **Strict boundaries on security topics**: You provide only high-level, general advice. Never give detailed instructions for configuring security tools, firewalls, EDR solutions, VPNs, access controls, or production security infrastructure. Never request or accept passwords, keys, internal diagrams, or sensitive data. If a topic requires hands-on implementation or forensic work, immediately recommend professional help.
- Keep responses clear and well-structured. Use bullet points and numbered steps when it helps.

### Cybersecurity Events Guidance (Very Important)
**Only** include cybersecurity-specific advice and the disclaimer below when the user explicitly asks about or describes a cybersecurity event, incident, threat, or related topic (e.g. phishing, malware, ransomware, account compromise, hacking, data breach, etc.).

- Do **not** mention cybersecurity disclaimers in general responses, capability questions, or unrelated troubleshooting.
- When a cyber security question **is** asked:
  - Provide **general educational advice and awareness only**. Cover recognition of common threats, high-level initial containment ideas (e.g. "consider isolating the affected device from the network if it is safe and practical to do so"), basic reporting steps, and prevention fundamentals (strong unique passwords, 2FA, keeping software updated, backups, user awareness).
  - **Always include a clear, visible disclaimer** (use very similar wording, and place it prominently — preferably near the start or end of the cyber-related part of your response):

    "**⚠️ Important Disclaimer: This is general educational advice only and is NOT professional cybersecurity incident response, technical support, or legal advice. If you are experiencing or suspect an active cybersecurity incident (phishing, malware, breach, ransomware, account compromise, etc.), STOP and immediately contact a qualified IT professional, your organization's security/incident response team, a certified cybersecurity firm, or law enforcement. Do not click links, enter credentials on untrusted sites, share sensitive information here, or take destructive actions without expert guidance. This chat cannot investigate, remediate, or respond to real incidents.**"

  - Stay calm and supportive. Prioritize user safety and professional escalation.
  - For anything beyond very basic general guidance, or if the situation sounds serious, strongly recommend professional assistance.

You may still help with related non-cyber troubleshooting (e.g. "my computer is slow"), but **do not** add the cyber disclaimer unless the user is asking about a security incident or threat.

### Visual Aids
You can describe steps clearly in text. The user has a "Generate visual aid" button in the chat interface they can use to request an AI-generated diagram at any time.

### Handling Capability Questions ("What can you help me fix?")
When the user asks "What can you help me fix?", "What issues do you solve?", "Can you help with ___?", "What are you good at?", or similar:

- Respond in a friendly, confident, and helpful tone.
- Briefly list these main categories (use this exact list):
  • Network & WiFi Problems
  • Computer & Device Issues
  • Browser Problems
  • Smart Home & IoT Devices
  • Printer & Peripheral Issues
  • Social Media & Apps
  • Email & Account Problems
  • Performance & Slow Tech
- Give 1-2 short, relatable examples for a couple of categories.
- Strongly encourage them to describe their specific problem: "Just tell me exactly what's happening (or upload a screenshot) and I'll walk you through clear, step-by-step fixes with pictures when helpful."
- Never say we can't help with common tech issues. Instead, guide them into starting the troubleshooting conversation.

### Tier-Specific Behavior
You will be told the user's current tier. Adjust your response depth accordingly:

**Current user tier: ${label} (style: ${style})**

- **concise style** (Free Trial / Single Use): Give clear but relatively concise answers. If the user asks for detailed step-by-step guidance, provide a helpful starting point and naturally suggest upgrading.
- **detailed style** (Home): Provide clear, detailed step-by-step guidance with practical tips and best practices. Richer how-to answers for device setup and basic productivity tasks. Use visuals when they help. For cybersecurity topics, include the required disclaimer and keep advice high-level.
- **rich style** (Small Business): Detailed, practical, business-oriented context when relevant. Structured and actionable. Use team-relevant visuals when helpful. For cybersecurity events, provide more structured general guidance (e.g. team communication, basic escalation processes) while always including the strong disclaimer and recommending professional incident response services.`;

  return basePrompt;
}

// =============================================
// API ROUTE
// =============================================
export async function POST(request: NextRequest) {
  try {
    const { message, imageUrl, history, generateVisualPrompt, diagnosticContext, deviceContext } = await request.json();

    // Create Supabase server client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use centralized resilient helper (profiles + user_tiers + pickHighest + usage snapshot).
    // This replaces ~50 lines of duplicated dual-read logic that existed in chat, image, diagnostics, etc.
    let usage: Awaited<ReturnType<typeof getUserTierAndUsage>>;
    try {
      usage = await getUserTierAndUsage(supabase, user.id);
    } catch (usageErr) {
      console.warn('Non-fatal: could not load usage numbers for AI prompt', usageErr);
      // Fallback to safe free trial values so chat can still attempt (server limit check below will be conservative)
      usage = {
        tier: 'free_trial' as Tier,
        sessionsUsed: 0,
        imagesUsed: 0,
        diagnosticsUsed: 0,
        chatLimit: 5,
        imageLimit: 1,
        diagnosticLimit: 1,
        imageResetDate: null,
        diagnosticResetDate: null,
        isUnlimitedChats: false,
      };
    }

    const userTier = usage.tier;
    const sessionsUsed = usage.sessionsUsed;
    const imagesUsed = usage.imagesUsed;
    const diagnosticsUsed = usage.diagnosticsUsed;
    const chatLimit = usage.chatLimit;
    const imageLimit = usage.imageLimit;
    const diagnosticLimit = usage.diagnosticLimit;
    const imageResetDate = usage.imageResetDate;
    const diagnosticResetDate = usage.diagnosticResetDate;

    const chatRemaining = usage.isUnlimitedChats ? 'Unlimited' : Math.max(0, chatLimit - sessionsUsed);
    const imageRemaining = Math.max(0, imageLimit - imagesUsed);
    const diagnosticRemaining = Math.max(0, diagnosticLimit - diagnosticsUsed);

    // Direct visual generation path (used by "Generate visual aid" button)
    if (generateVisualPrompt && typeof generateVisualPrompt === 'string') {
      const visualUrl = await generateImage(generateVisualPrompt);
      if (visualUrl) {
        return NextResponse.json({
          reply: "Here's a generated visual aid to help with your troubleshooting:",
          imageUrl: visualUrl,
        });
      }
      // Fallback if generation failed
      return NextResponse.json({
        reply: "I tried to generate a visual but ran into an issue. Here's the text guidance instead:",
      });
    }

    // === SERVER-SIDE CHAT SESSIONS LIMIT ENFORCEMENT (authoritative source of truth) ===
    // Normal chat turns (not the pure visual gen helper) are counted here.
    // Client does fast pre-check too; this prevents bypass and ensures count is accurate.
    try {
      let pTier: string | null = null;
      let pUsed = 0;
      let uTier: string | null = null;
      let uUsed = 0;

      const { data: prof } = await supabase
        .from('profiles')
        .select('tier, sessions_used')
        .eq('id', user.id)
        .maybeSingle();
      if (prof) {
        pTier = prof.tier;
        pUsed = prof.sessions_used || 0;
      }

      const { data: ut } = await supabase
        .from('user_tiers')
        .select('tier, sessions_used')
        .eq('user_id', user.id)
        .maybeSingle();
      if (ut) {
        uTier = ut.tier;
        uUsed = ut.sessions_used || 0;
      }

      const resolvedTier = pickHighestTier(pTier, uTier);
      const used = pUsed || uUsed;
      const lim = getLimit(resolvedTier);

      if (lim < 9999 && used >= lim) {
        return NextResponse.json(
          {
            error: `You've reached the maximum of ${lim} chats for your current plan. Upgrade for unlimited chats and more features.`,
            code: 'CHAT_LIMIT'
          },
          { status: 402 }
        );
      }

      // Increment usage for this turn. Sync both tables for resilience (like image + diag flows)
      const newUsed = used + 1;
      const now = new Date().toISOString();
      try {
        await supabase
          .from('profiles')
          .update({ sessions_used: newUsed, updated_at: now })
          .eq('id', user.id);

        await supabase
          .from('user_tiers')
          .upsert({
            user_id: user.id,
            tier: resolvedTier,
            sessions_used: newUsed,
            updated_at: now,
          });
      } catch (incErr) {
        console.warn('Non-fatal: failed to increment sessions_used (chat will still be processed):', incErr);
      }
    } catch (chkErr) {
      console.warn('Non-fatal chat sessions limit check error (allowing request):', chkErr);
    }

    // Build tier-aware system prompt + current usage so the AI can answer quota questions accurately
    const baseSystemPrompt = getMyTechFixSystemPrompt(userTier);

    const usageInfo = `

### Your Current Credits / Usage (exact live numbers)
When the user asks anything like "how many credits do I have left?", "how many chats/images/diagnostics left?", "what's my remaining quota?", "how much usage do I have?", use these precise values:

- Chat / troubleshooting sessions: ${sessionsUsed} used — ${chatRemaining} remaining (plan limit: ${chatLimit === 9999 ? 'Unlimited' : chatLimit})
- AI Image / Visual generation credits: ${imagesUsed} used — ${imageRemaining} remaining this period (plan limit: ${imageLimit})
- Automated Diagnostics runs: ${diagnosticsUsed} used — ${diagnosticRemaining} remaining this period (plan limit: ${diagnosticLimit})

${imageResetDate ? `- Image quota next resets: ${new Date(imageResetDate).toLocaleDateString()}` : ''}
${diagnosticResetDate ? `- Diagnostics quota next resets: ${new Date(diagnosticResetDate).toLocaleDateString()}` : ''}

Be direct and accurate. Example good answer: "You have 12 chats and 7 image credits left this period."`;

    let systemPrompt = baseSystemPrompt + usageInfo;

    // === DIAGNOSTIC REPORT INJECTION (auto-inject feature) ===
    // If the client sent structured diagnosticContext (from a ?diagnostic=ID flow or future picker),
    // turn the raw results + prior analysis into a compact, high-signal block and append it to the
    // system prompt. This ensures the model has the *exact* numbers (more reliable than relying on
    // whatever text the user sees in the chat bubble).
    if (diagnosticContext && diagnosticContext.results) {
      try {
        const reportBlock = formatDiagnosticReportForChat(
          diagnosticContext.results,
          diagnosticContext.analysis,
          diagnosticContext.run_type
        );
        systemPrompt = systemPrompt + `\n\n### Recently Injected Diagnostic Report\nThe user ran an automated diagnostic and wants troubleshooting help grounded in these objective results.\n\n${reportBlock}\n\nReference the specific values, statuses, and any prior analysis above when giving advice. Be concrete and actionable.`;
      } catch (e) {
        // Non-fatal: fall back to including a raw snippet so we don't lose the data entirely.
        systemPrompt = systemPrompt + `\n\n### Injected Diagnostic Context (raw)\n${JSON.stringify(diagnosticContext.results).slice(0, 2000)}`;
      }
    }

    // === DEVICE CONTEXT INJECTION (from inventory "Troubleshoot" button) ===
    if (deviceContext && deviceContext.name) {
      const parts = [`Device name: ${deviceContext.name}`];
      if (deviceContext.type) parts.push(`Device type: ${deviceContext.type}`);
      if (deviceContext.location) parts.push(`Location: ${deviceContext.location}`);
      systemPrompt = systemPrompt + `\n\n### Device Being Troubleshot\nThe user is troubleshooting a specific device from their business inventory. Tailor your guidance to this device context and reference it naturally in your responses:\n${parts.join('\n')}`;
    }

    // Prepare messages for Grok
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
    ];

    // Add current user message (handle image if present)
    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message || "Please analyze this image" },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: message
      });
    }

    // Call Grok API
    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3-latest',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('Grok API error:', errorText);

      const status = grokResponse.status;
      let code = 'GROK_ERROR';
      let message = 'Our AI helper is temporarily unavailable.';

      if (status === 429) {
        code = 'GROK_RATE_LIMIT';
        message = 'AI rate limit reached. Please wait a moment and try again.';
      } else if (status === 401 || status === 403) {
        code = 'GROK_AUTH_ERROR';
        message = 'AI service configuration issue.';
      }

      return NextResponse.json(
        { error: message, code, provider: 'grok' },
        { status: status >= 500 ? 502 : status }
      );
    }

    const data = await grokResponse.json();
    let replyText: string = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Strip any stray [GENERATE_VISUAL: ...] tokens the model might emit despite the prompt change
    replyText = replyText.replace(/\[GENERATE_VISUAL:\s*[^\]]+\]/gi, '').trim();

    return NextResponse.json({ reply: replyText });

  } catch (error: any) {
    console.error('Chat API error:', error);

    // Distinguish common failure modes for better client UX
    if (error?.message?.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error talking to AI. Check your connection.', code: 'NETWORK_ERROR' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again.', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}