'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare, LayoutDashboard, Monitor, Clock,
  Activity, Sparkles, BookOpen, FileText, Bell, User,
  CreditCard, LogOut, Users, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { pickHighestTier } from '@/lib/tiers';
import PlanBadge from '@/components/PlanBadge';

interface Props {
  onClose: () => void;
}

export default function SidebarNav({ onClose }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [tier, setTier] = useState('free_trial');
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    setCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: ut }] = await Promise.all([
        supabaseBrowser.from('profiles').select('tier').eq('id', user.id).maybeSingle(),
        supabaseBrowser.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle(),
      ]);
      setTier(pickHighestTier(p?.tier ?? 'free_trial', ut?.tier ?? 'free_trial'));
    })();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    supabaseBrowser
      .from('device_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [user]);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const linkClass = (href: string, exact = false) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
      isActive(href, exact)
        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border-transparent'
    } ${collapsed ? 'justify-center' : 'justify-start'}`;

  const canUseProductivity = !['free_trial', 'single_use'].includes(tier);
  const isBusinessPlus = ['business', 'business_plus'].includes(tier);

  const sectionLabel = (label: string) =>
    collapsed ? (
      <div className="my-2 border-t border-white/[0.06]" />
    ) : (
      <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
        {label}
      </div>
    );

  return (
    <div
      className={`h-full flex flex-col border-r border-white/[0.07] bg-[#060D1A] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center flex-shrink-0 px-3 py-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {collapsed ? (
          <Link
            href="/dashboard"
            onClick={onClose}
            className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg shadow-md hover:opacity-80 transition-opacity"
          >
            🔧
          </Link>
        ) : (
          <>
            <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg shadow-md flex-shrink-0">
                🔧
              </div>
              <span className="font-sora font-bold text-slate-50 text-base">
                MyTech<span className="text-blue-400">Fix</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-600 hover:text-slate-400 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* User info */}
      {user && (
        <div className={`px-3 pb-4 flex-shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <>
              <div className="text-sm font-medium text-slate-200 truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-slate-600 truncate mb-2">{user.email}</div>
              <PlanBadge tier={tier} />
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {sectionLabel('Main')}

        {[
          { label: 'Chat',        href: '/chat',        Icon: MessageSquare },
          { label: 'Dashboard',   href: '/dashboard',   Icon: LayoutDashboard },
          { label: 'Devices',     href: '/my-devices',  Icon: Monitor },
          { label: 'History',     href: '/history',     Icon: Clock },
          { label: 'Diagnostics', href: '/diagnostics', Icon: Activity },
        ].map(({ label, href, Icon }) => (
          <Link key={href} href={href} onClick={onClose} className={linkClass(href)}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}

        {canUseProductivity && (
          <Link href="/productivity" onClick={onClose} className={linkClass('/productivity', true)}>
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">Productivity</span>}
          </Link>
        )}

        <Link href="/fix" onClick={onClose} className={linkClass('/fix')}>
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Guides</span>}
        </Link>

        <Link href="/docs" onClick={onClose} className={linkClass('/docs')}>
          <FileText className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Docs</span>}
        </Link>

        {sectionLabel('Account')}

        {/* Notifications — with unread badge */}
        <Link href="/account/notifications" onClick={onClose} className={linkClass('/account/notifications', true)}>
          <div className="relative flex-shrink-0">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-3.5 min-w-3.5 flex items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white px-0.5 leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          {!collapsed && (
            <>
              <span className="flex-1 truncate">Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-blue-500 text-white rounded-full px-1.5 py-0.5 leading-tight">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </>
          )}
        </Link>

        <Link href="/account" onClick={onClose} className={linkClass('/account', true)}>
          <User className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Account</span>}
        </Link>

        <Link href="/upgrade" onClick={onClose} className={linkClass('/upgrade')}>
          <CreditCard className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Billing</span>}
        </Link>

        {isBusinessPlus && (
          <Link href="/teams" onClick={onClose} className={linkClass('/teams')}>
            <Users className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">Teams</span>}
          </Link>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-2 py-3 border-t border-white/[0.07] space-y-0.5">
        <button
          onClick={() => supabaseBrowser.auth.signOut().then(() => { window.location.href = '/'; })}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Sign out</span>}
        </button>

        <button
          onClick={toggleCollapse}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
