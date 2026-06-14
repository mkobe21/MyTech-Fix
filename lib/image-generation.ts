/**
 * Shared image generation logic for MyTech-Fix.
 * Supports:
 * - OpenAI DALL-E 3 (if OPENAI_API_KEY present) for high quality diagrams
 * - xAI image gen (uses XAI_API_KEY, falls back to GROK_API_KEY for compatibility)
 *
 * For xAI images, defaults to model "grok-imagine-image-quality" (used by chat visual features).
 * Always appends strong instructions for correct spelling + technical clarity.
 */

export async function generateImage(prompt: string): Promise<string | null> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const xaiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;

  let provider: 'openai' | 'xai';
  let apiKey: string;

  if (openaiKey) {
    provider = 'openai';
    apiKey = openaiKey;
  } else if (xaiKey) {
    provider = 'xai';
    apiKey = xaiKey;
  } else {
    console.error('CRITICAL: No image generation key found (XAI_API_KEY or GROK_API_KEY or OPENAI_API_KEY). Add XAI_API_KEY=... to .env.local (for xAI images with grok-imagine-image-quality), then restart the dev server.');
    return null;
  }

  // Dev-only diagnostic (never log full key)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[image-gen] Using provider=${provider} (key len=${apiKey.length}, prefix=${apiKey.slice(0,6)}...)`);
  }

  // Strengthen prompt for spelling/quality (critical for troubleshooting diagrams)
  const spellingBooster = " . All text, labels, button names, port labels, arrows, and annotations MUST be spelled 100% correctly with perfectly legible sans-serif text. No misspellings, no garbled letters, no hallucinations on words. Clean technical schematic / instruction manual style, high contrast, precise details, educational clarity.";
  const cleanPrompt = (prompt.trim().slice(0, 1200) + spellingBooster).trim();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // longer for DALL-E

    let res: Response;

    if (provider === 'openai') {
      // DALL-E 3: far superior for accurate text, spelling, following complex diagram instructions, and "hd" quality
      const body = {
        model: 'dall-e-3',
        prompt: cleanPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd', // higher quality (recommended for diagrams)
      };

      res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } else {
      // xAI image gen (ensure model "grok-imagine-image-quality" for chat visuals)
      const model = process.env.XAI_IMAGE_MODEL || 'grok-imagine-image-quality';
      const body: any = {
        model,
        prompt: cleanPrompt,
        n: 1,
      };

      res = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    }

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[image-gen] ${provider.toUpperCase()} error:`, res.status, errText);
      console.error('  Hint: For xAI images, use XAI_API_KEY in .env.local and model grok-imagine-image-quality (or set XAI_IMAGE_MODEL).');
      return null;
    }

    const data = await res.json();
    const url = data?.data?.[0]?.url || (data?.data?.[0]?.b64_json ? `data:image/png;base64,${data.data[0].b64_json}` : null);
    if (url && process.env.NODE_ENV !== 'production') {
      console.log(`[image-gen] Success via ${provider} (model: ${provider === 'xai' ? (process.env.XAI_IMAGE_MODEL || 'grok-imagine-image-quality') : 'dall-e-3'})`);
    }
    return url;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      console.error('Image generation timed out');
    } else {
      console.error('Image generation failed (network or unexpected):', err?.message || err);
    }
    return null;
  }
}
