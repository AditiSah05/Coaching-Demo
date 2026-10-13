"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, UserCheck, HelpCircle, 
  Award, FileText, Image, MessageSquare, Users, Megaphone, 
  Settings, User, LogOut, Menu, X, ExternalLink, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AdminLayout = ({ children }) => {
  const { isAuthenticated, ready, session, logout } = useAuth();
  const { settings } = useData();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Protected Route Check (session loads from localStorage after mount)
  useEffect(() => {
    if (ready && !isAuthenticated) router.replace('/admin/login');
  }, [ready, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Courses Manager', path: '/admin/courses', icon: BookOpen },
    { label: 'Admissions Log', path: '/admin/admissions', icon: UserCheck },
    { label: 'Enquiries Desk', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Study Material Leads', path: '/admin/leads', icon: Users },
    { label: 'Results & Toppers', path: '/admin/results', icon: Award },
    { label: 'Study Materials', path: '/admin/study-materials', icon: FileText },
    { label: 'Institute Forms', path: '/admin/forms', icon: FileText },
    { label: 'Photo Gallery', path: '/admin/gallery', icon: Image },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Faculty Roster', path: '/admin/faculty', icon: Users },
    { label: 'FAQs Manager', path: '/admin/faqs', icon: HelpCircle },
    { label: 'Banners & Ribbon', path: '/admin/banners', icon: Megaphone },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
    { label: 'Admin Profile', path: '/admin/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col md:flex-row">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-dark text-ivory border-r border-sea-blue/20 shrink-0 select-none">
        
        {/* Brand */}
        <div className="p-6 border-b border-sea-blue/20 flex items-center gap-3">
          <img src="/logo.png" alt="Pacific Marine Academy" className="w-10 h-10 rounded-full shrink-0 bg-white" />
          <div>
            <h2 className="font-serif font-bold text-lg text-white leading-tight">PMA ADMIN</h2>
            <span className="text-[10px] text-sea-blue uppercase tracking-widest font-semibold block">Control Panel</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-terracotta text-white font-bold shadow-terracotta'
                    : 'text-ivory/80 hover:bg-navy-light/60 hover:text-sea-blue'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Info & Logout */}
        <div className="p-4 border-t border-sea-blue/20 bg-navy-deep space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="font-bold text-white block truncate">{session?.user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-gold">{session?.user?.role || 'Super Admin'}</span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg bg-navy-light text-red-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-sea-blue/20 text-sea-blue hover:bg-sea-blue hover:text-navy-deep rounded-xl text-[11px] font-bold transition-colors"
          >
            <span>View Live Website</span> <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-navy-dark text-white p-4 flex items-center justify-between border-b border-sea-blue/20 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Pacific Marine Academy" className="w-8 h-8 rounded-full shrink-0 bg-white" />
            <span className="font-serif font-bold text-base">PMA Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-sea-blue underline">Site</Link>
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-lg bg-navy-light text-white"
            >
              {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {mobileDrawerOpen && (
          <div className="md:hidden bg-navy-dark text-white p-4 space-y-1 border-b border-sea-blue/20 max-h-[70vh] overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-terracotta text-white font-bold' : 'text-ivory/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => { setMobileDrawerOpen(false); logout(); }}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
