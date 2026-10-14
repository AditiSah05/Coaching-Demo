// Accepts a Shorts / watch / youtu.be link or a bare 11-character video id.
export const youtubeId = (value = '') => {
  const v = String(value).trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  const m = v.match(/(?:youtube\.com\/(?:shorts\/|embed\/|watch\?(?:.*&)?v=)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
};
