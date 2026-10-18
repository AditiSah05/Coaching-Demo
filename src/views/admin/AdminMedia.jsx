"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Copy } from 'lucide-react';
import { request } from '../../services/api';
import { Button, PageHeader, Empty, Spinner, useFeedback, uploadImage, fmtDate, focus } from '../../components/admin/ui';

const kb = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export const AdminMedia = () => {
  const { toast, confirm } = useFeedback();
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  const load = useCallback(async () => { try { setItems((await request('/api/admin/media')).media); } catch (e) { toast(e.message, 'error'); setItems([]); } }, [toast]);
  useEffect(() => { load(); }, [load]);

  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    let ok = 0;
    for (const f of files) { try { await uploadImage(f); ok += 1; } catch (e) { toast(`${f.name}: ${e.message}`, 'error'); } }
    if (ok) toast(`${ok} image${ok > 1 ? 's' : ''} uploaded.`);
    setBusy(false); if (input.current) input.current.value = ''; load();
  };
  const remove = async (m) => {
    if (!(await confirm({ title: 'Delete this image?', message: 'Pages that still use it will show a broken picture. This cannot be undone.' }))) return;
    try { await request(`/api/admin/media/${m.id}`, { method: 'DELETE' }); toast('Deleted.'); load(); } catch (e) { toast(e.message, 'error'); }
  };
  const copy = async (m) => { try { await navigator.clipboard.writeText(`${location.origin}${m.url}`); toast('Link copied.'); } catch { toast(m.url); } };

  return (
    <div>
      <PageHeader title="Media library" subtitle="Images you upload are shrunk to a web-friendly size and kept here, so you can reuse them anywhere on the site."
        actions={<Button onClick={() => input.current?.click()} loading={busy}><Upload className="h-4 w-4" /> Upload images</Button>} />
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => upload([...e.target.files])} />
      {items === null ? <Spinner /> : items.length === 0 ? <Empty title="No uploaded images yet">Click "Upload images". JPG, PNG, WebP and GIF files up to 8 MB are accepted.</Empty> : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-navy-deep/10 bg-white shadow-sm">
              <img src={m.url} alt={m.name} loading="lazy" className="aspect-square w-full bg-ivory object-cover" />
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-navy-deep" title={m.name}>{m.name}</p>
                <p className="text-xs text-ink/55">{m.width ? `${m.width}×${m.height} · ` : ""}{kb(m.size)} · {fmtDate(m.createdAt)}</p>
                <div className="mt-2 flex gap-1.5">
                  <button onClick={() => copy(m)} className={`inline-flex min-h-[34px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-navy-deep/20 text-xs font-semibold text-navy-deep hover:bg-gold-light ${focus}`}><Copy className="h-3.5 w-3.5" /> Copy link</button>
                  <button onClick={() => remove(m)} aria-label={`Delete ${m.name}`} className={`inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg text-red-600 hover:bg-red-50 ${focus}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
