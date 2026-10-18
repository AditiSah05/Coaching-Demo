"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MessageSquare, UserCheck, Star, Bell, CheckCheck, Trash2 } from 'lucide-react';
import { request } from '../../services/api';
import { Button, PageHeader, Spinner, Empty, ago, useFeedback, focus } from '../../components/admin/ui';

const icons = { enquiry: MessageSquare, admission: UserCheck, review: Star };

export const AdminNotifications = () => {
  const { toast } = useFeedback();
  const [data, setData] = useState(null);
  const load = useCallback(async () => { try { setData(await request('/api/admin/notifications')); } catch (e) { toast(e.message, 'error'); setData({ unread: 0, notifications: [] }); } }, [toast]);
  useEffect(() => { load(); }, [load]);
  const act = async (body) => { await request('/api/admin/notifications', { method: 'POST', body }); load(); };

  return (
    <div>
      <PageHeader title="Notifications" subtitle="A new enquiry, admission application or review adds a notification here."
        actions={data?.notifications.length > 0 && <>
          <Button variant="ghost" onClick={() => act({ action: 'readAll' })} disabled={!data.unread}><CheckCheck className="h-4 w-4" /> Mark all read</Button>
          <Button variant="ghost" onClick={() => act({ action: 'clear' })}><Trash2 className="h-4 w-4" /> Clear read</Button>
        </>} />
      {data === null ? <Spinner /> : data.notifications.length === 0 ? <Empty title="No notifications">You will be told here when someone sends an enquiry, applies, or writes a review.</Empty> : (
        <ul className="divide-y divide-navy-deep/10 overflow-hidden rounded-2xl border border-navy-deep/10 bg-white shadow-sm">
          {data.notifications.map((n) => {
            const Icon = icons[n.type] || Bell;
            return (
              <li key={n.id}>
                <Link href={n.link || '#'} onClick={() => !n.read && act({ action: 'read', id: n.id })} className={`flex items-start gap-4 px-5 py-4 hover:bg-ivory ${focus} ${n.read ? '' : 'bg-gold-light/40'}`}>
                  <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.read ? 'bg-navy-deep/8 text-navy-deep/60' : 'bg-gold text-navy-deep'}`}><Icon className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm ${n.read ? 'text-navy-deep' : 'font-semibold text-navy-deep'}`}>{n.title}</span>
                    {n.body && <span className="mt-0.5 line-clamp-2 block text-sm text-ink/65">{n.body}</span>}
                    <span className="mt-1 block text-xs text-ink/45">{ago(n.createdAt)}</span>
                  </span>
                  {!n.read && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" aria-label="Unread" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
