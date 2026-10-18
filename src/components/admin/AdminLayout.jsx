"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Bell, MessageSquare, UserCheck, Star, BookOpen, Newspaper, Image as ImageIcon, Video, FileText, ClipboardList,
  Award, Users, HelpCircle, Megaphone, Settings, Images, UserCog, History, DatabaseBackup, LogOut, Menu, X, ExternalLink, KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { request } from '../../services/api';
import { can } from '../../shared/schema';
import { FeedbackProvider, useFeedback, ago, focus } from './ui';

const nav = [
  { group: 'Overview', items: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, area: 'dashboard' },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell, area: 'dashboard', badge: true },
  ] },
  { group: 'Inbox', items: [
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare, area: 'enquiries' },
    { label: 'Admissions', path: '/admin/admissions', icon: UserCheck, area: 'admissions' },
    { label: 'Reviews', path: '/admin/reviews', icon: Star, area: 'reviews' },
  ] },
  { group: 'Content', items: [
    { label: 'Courses', path: '/admin/courses', icon: BookOpen, area: 'courses' },
    { label: 'Blog', path: '/admin/blogs', icon: Newspaper, area: 'blogs' },
    { label: 'Photo gallery', path: '/admin/gallery', icon: ImageIcon, area: 'gallery' },
    { label: 'Video gallery', path: '/admin/videos', icon: Video, area: 'videos' },
    { label: 'Study materials', path: '/admin/study-materials', icon: FileText, area: 'studyMaterials' },
    { label: 'Exam forms', path: '/admin/forms', icon: ClipboardList, area: 'forms' },
    { label: 'Results', path: '/admin/results', icon: Award, area: 'resultPosters' },
    { label: 'Team', path: '/admin/faculty', icon: Users, area: 'faculty' },
    { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle, area: 'faqs' },
  ] },
  { group: 'Site', items: [
    { label: 'Announcement bar', path: '/admin/banners', icon: Megaphone, area: 'banners' },
    { label: 'Site settings', path: '/admin/settings', icon: Settings, area: 'settings' },
    { label: 'Media library', path: '/admin/media', icon: Images, area: 'media' },
  ] },
  { group: 'System', items: [
    { label: 'Users', path: '/admin/users', icon: UserCog, area: 'users' },
    { label: 'Activity log', path: '/admin/activity', icon: History, area: 'activity' },
    { label: 'Backup', path: '/admin/backup', icon: DatabaseBackup, area: 'backup' },
  ] },
];

const Shell = ({ children }) => {
  const { user, ready, logout } = useAuth();
  const { settings } = useData();
  const { toast } = useFeedback();
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [unread, setUnread] = useState(0);
  const [bell, setBell] = useState(false);
  const [recent, setRecent] = useState([]);
  const last = useRef(null);

  useEffect(() => { if (ready && !user) router.replace('/admin/login'); }, [ready, user, router]);
  useEffect(() => { if (user?.mustChangePassword && pathname !== '/admin/profile') router.replace('/admin/profile'); }, [user, pathname, router]);
  useEffect(() => { setDrawer(false); setBell(false); }, [pathname]);

  // Check for new notifications every 20 seconds, and show the count in the browser tab.
  useEffect(() => {
    if (!user) return undefined;
    let stop = false;
    const poll = async () => {
      try {
        const d = await request('/api/admin/notifications');
        if (stop) return;
        if (last.current !== null && d.unread > last.current) {
          const fresh = d.notifications.find((n) => !n.read);
          if (fresh) toast(fresh.title);
        }
        last.current = d.unread;
        setUnread(d.unread);
        setRecent(d.notifications.slice(0, 6));
      } catch { /* a missed check is fine; the next one retries */ }
    };
    poll();
    const t = setInterval(poll, 20000);
    const onFocus = () => poll();
    window.addEventListener('focus', onFocus);
    return () => { stop = true; clearInterval(t); window.removeEventListener('focus', onFocus); };
  }, [user, toast]);

  useEffect(() => {
    const base = document.title.replace(/^\(\d+\)\s*/, '');
    document.title = unread ? `(${unread}) ${base}` : base;
  }, [unread, pathname]);

  const markAll = async () => { await request('/api/admin/notifications', { method: 'POST', body: { action: 'readAll' } }); last.current = 0; setUnread(0); setRecent((r) => r.map((n) => ({ ...n, read: true }))); };

  if (!ready || !user) return <div className="flex min-h-screen items-center justify-center bg-ivory text-sm text-ink/60">Loading…</div>;

  const groups = nav.map((g) => ({ ...g, items: g.items.filter((i) => can(user.role, i.area)) })).filter((g) => g.items.length);
  const active = (p) => (p === '/admin' ? pathname === '/admin' : pathname === p || pathname.startsWith(`${p}/`));

  const Sidebar = (
    <div className="flex h-full flex-col bg-navy-dark text-white">
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <img src="/logo.png" alt="" className="h-10 w-10 shrink-0 rounded-full bg-white" />
        <div className="min-w-0">
          <p className="truncate font-serif text-lg font-semibold leading-tight">{settings?.instituteName || 'Admin'}</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Admin panel</p>
        </div>
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((i) => {
                const Icon = i.icon;
                const on = active(i.path);
                return (
                  <li key={i.path}>
                    <Link href={i.path} aria-current={on ? 'page' : undefined} className={`flex min-h-[40px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${focus} ${on ? 'bg-gold text-navy-deep' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1">{i.label}</span>
                      {i.badge && unread > 0 && <span className="rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-5 text-white">{unread > 99 ? '99+' : unread}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/admin/profile" className={`flex items-center gap-3 rounded-lg p-2 hover:bg-white/10 ${focus}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy-deep">{user.name.slice(0, 1).toUpperCase()}</span>
          <span className="min-w-0 text-sm"><span className="block truncate font-semibold">{user.name}</span><span className="block truncate text-xs text-white/50">{user.email}</span></span>
        </Link>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className={`flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/20 ${focus}`}>View site <ExternalLink className="h-3 w-3" /></a>
          <button onClick={async () => { await logout(); router.replace('/admin/login'); }} className={`flex min-h-[38px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white/10 text-xs font-semibold hover:bg-red-500 ${focus}`}><LogOut className="h-3.5 w-3.5" /> Sign out</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ivory text-ink">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 md:block">{Sidebar}</aside>
      {drawer && (
        <div className="fixed inset-0 z-[150] md:hidden">
          <div className="absolute inset-0 bg-navy-dark/70" onClick={() => setDrawer(false)} />
          <div className="relative h-full w-72 max-w-[85vw]">{Sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-navy-deep/10 bg-white/90 px-4 py-2.5 backdrop-blur sm:px-8">
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-navy-deep/5 md:hidden ${focus}`}><Menu className="h-5 w-5" /></button>
          <p className="hidden text-sm text-ink/55 md:block">Signed in as <strong className="text-navy-deep">{user.name}</strong></p>
          <div className="relative ml-auto">
            <button onClick={() => setBell(!bell)} aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-expanded={bell} className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-navy-deep/5 ${focus}`}>
              <Bell className="h-5 w-5" />
              {unread > 0 && <span className="absolute right-0.5 top-0.5 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[11px] font-bold leading-[18px] text-white">{unread > 99 ? '99+' : unread}</span>}
            </button>
            {bell && (
              <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-navy-deep/10 bg-white shadow-chunky-lg">
                <div className="flex items-center justify-between border-b border-navy-deep/10 px-4 py-3">
                  <p className="font-serif text-lg font-semibold text-navy-deep">Notifications</p>
                  {unread > 0 && <button onClick={markAll} className={`cursor-pointer text-xs font-semibold text-navy-deep underline decoration-gold underline-offset-2 ${focus}`}>Mark all read</button>}
                </div>
                {recent.length === 0 ? <p className="px-4 py-8 text-center text-sm text-ink/55">Nothing new.</p> : (
                  <ul className="max-h-80 divide-y divide-navy-deep/10 overflow-y-auto">
                    {recent.map((n) => (
                      <li key={n.id}>
                        <Link href={n.link || '/admin/notifications'} className={`block px-4 py-3 hover:bg-ivory ${focus} ${n.read ? '' : 'bg-gold-light/50'}`}>
                          <p className="text-sm font-semibold text-navy-deep">{n.title}</p>
                          {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-ink/65">{n.body}</p>}
                          <p className="mt-1 text-[11px] text-ink/45">{ago(n.createdAt)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/admin/notifications" className={`block border-t border-navy-deep/10 px-4 py-3 text-center text-sm font-semibold text-navy-deep hover:bg-ivory ${focus}`}>See all notifications</Link>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {user.mustChangePassword && (
            <div role="alert" className="mb-6 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"><KeyRound className="h-4 w-4 shrink-0" /> You are using the starting password. Set a new one to continue.</div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export const AdminLayout = ({ children }) => (
  <FeedbackProvider>
    <Shell>{children}</Shell>
  </FeedbackProvider>
);
