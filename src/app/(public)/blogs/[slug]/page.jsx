import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import { publicContent, publishedPost } from '../../../../server/content';
import { formatDate } from '../../../../lib/blog';
import { PostCover } from '../../../../components/blog/PostCover';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

// Posts can be added, edited or unpublished from the admin at any time, so these pages are built on request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = publishedPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Pacific Marine Academy`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date, images: post.cover ? [post.cover] : undefined },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = publishedPost(slug);
  if (!post) notFound();
  const html = post.content;
  const blogPosts = publicContent().blogs;

  const related = [
    ...blogPosts.filter((p) => p.slug !== slug && p.topic === post.topic),
    ...blogPosts.filter((p) => p.slug !== slug && p.topic !== post.topic),
  ].slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <article>
        <header className="border-b border-navy-deep/10">
          <div className="mx-auto max-w-3xl px-4 pb-10 pt-10 sm:px-6 lg:pb-12 lg:pt-14">
            <Link href="/blogs" className={`inline-flex items-center gap-2 text-sm font-semibold text-ink/65 transition-colors hover:text-navy-deep ${focusRing}`}>
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
              <span className="text-goldtext">{post.topic}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.minutes} min read</span>
            </p>
            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-navy-deep sm:text-5xl">{post.title}</h1>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="prose-pma" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>

      <section aria-label="Join the academy" className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="grid items-center gap-5 rounded-3xl bg-navy-deep p-8 text-white sm:grid-cols-[1fr_auto] sm:p-10">
          <div>
            <h2 className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">Preparing for the IMU CET?</h2>
            <p className="mt-2 text-white/70">Talk to a counsellor at Pacific Marine Academy in Sikar.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admission" className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gold px-7 text-sm font-extrabold uppercase tracking-wider text-navy-deep transition hover:brightness-110 ${focusRing}`}>
              Enrol now <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold ${focusRing}`}>
              <Phone className="h-4 w-4" /> Contact us
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="More articles" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">Keep reading</h2>
          <Link href="/blogs" className={`inline-flex items-center gap-2 text-sm font-semibold text-navy-deep underline decoration-gold decoration-2 underline-offset-4 ${focusRing}`}>
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-8 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <li key={p.slug}>
              <article className="group relative">
                <span className="block aspect-[16/10] overflow-hidden rounded-2xl border border-navy-deep/10 bg-ivory-dark">
                  <span className="block h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"><PostCover post={p} /></span>
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-goldtext">{p.topic}</p>
                <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-navy-deep">
                  <Link href={`/blogs/${p.slug}`} className={`after:absolute after:inset-0 group-hover:text-goldtext ${focusRing}`}>{p.title}</Link>
                </h3>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
