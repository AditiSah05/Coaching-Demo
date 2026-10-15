// A post's picture, or a designed cover when the original post had no image.
export const PostCover = ({ post, className = '', imgClass = '' }) =>
  post.cover ? (
    <img src={post.cover} alt="" loading="lazy" className={`h-full w-full object-cover object-top ${imgClass}`} />
  ) : (
    <span className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-navy-deep p-5 text-white ${className}`} aria-hidden="true">
      <span className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-gold/20" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 rounded-full border border-gold/15" />
      <span className="font-serif text-6xl leading-none text-gold">“</span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{post.topic}</span>
    </span>
  );
