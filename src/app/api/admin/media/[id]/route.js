import { guard, logActivity } from '../../../../../server/auth';
import { mutate } from '../../../../../server/store';
import { removeFile } from '../../../../../server/media';
import { json } from '../../../../../server/http';

export async function DELETE(request, { params }) {
  const g = await guard(request, 'media');
  if (g.response) return g.response;
  const { id } = await params;
  let gone = null;
  await mutate((db) => {
    const i = db.media.findIndex((m) => m.id === id);
    if (i < 0) return;
    [gone] = db.media.splice(i, 1);
    logActivity(db, g.user, 'Deleted image', gone.name);
  });
  if (!gone) return json({ error: 'Not found.' }, 404);
  await removeFile(gone.file);
  return json({ ok: true });
}
