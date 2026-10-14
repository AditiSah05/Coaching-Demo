"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { youtubeId } from '../../lib/youtube';

const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const embed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;

// Centre-card player. A transparent layer sits over the iframe so swipes/scrolls still reach the
// carousel (an iframe swallows them); pause and sound are driven through YouTube's postMessage API.
const Player = ({ id, startMuted }) => {
  const frame = useRef(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(startMuted);
  const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=${startMuted ? 1 : 0}&controls=0&loop=1&playlist=${id}&rel=0&playsinline=1&modestbranding=1&enablejsapi=1&origin=${origin}`;

  const send = (func) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
  const togglePlay = () => { send(paused ? 'playVideo' : 'pauseVideo'); setPaused(!paused); };
  const toggleSound = () => { send(muted ? 'unMute' : 'mute'); setMuted(!muted); };

  return (
    <div className="absolute inset-0">
      <iframe ref={frame} src={src} title="Pacific Marine Academy YouTube Short" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
      <button onClick={togglePlay} aria-label={paused ? 'Play' : 'Pause'} className="absolute inset-0 z-10 cursor-pointer" />
      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        <button onClick={togglePlay} aria-label={paused ? 'Play' : 'Pause'} className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep/70 text-white backdrop-blur transition-colors hover:bg-navy-deep">
          {paused ? <Play className="ml-0.5 h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
        </button>
        <button onClick={toggleSound} aria-label={muted ? 'Unmute' : 'Mute'} className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep/70 text-white backdrop-blur transition-colors hover:bg-navy-deep">
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

// Plain click-to-play card, used by the grid on the Videos page.
const Short = ({ id }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-[9/16] w-[210px] shrink-0 snap-start overflow-hidden rounded-2xl border border-navy-deep/10 bg-navy-deep shadow-chunky sm:w-[240px]">
      {playing ? (
        <iframe src={embed(id)} title="Pacific Marine Academy YouTube Short" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
      ) : (
        <button onClick={() => setPlaying(true)} aria-label="Play YouTube Short" className="group absolute inset-0">
          <img src={thumb(id)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-deep shadow-chunky transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
};

// Coverflow: the centred Short is large, neighbours step back, smaller and fainter.
const VISIBLE = 4;
const Coverflow = ({ ids, active, onPick, playing, onPlay }) => {
  const n = ids.length;
  const drag = useRef(null);
  const stage = useRef(null);
  const latest = useRef({ active, onPick });
  latest.current = { active, onPick };
  const centerEl = useRef(null);

  // After a swipe/arrow brings a new card to the front under a resting pointer, hover-play it too.
  useEffect(() => {
    const t = setTimeout(() => {
      if (centerEl.current?.matches(':hover')) onPlay(ids[active], true);
    }, 560);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Horizontal trackpad / shift+wheel moves between Shorts; plain vertical scroll still scrolls the page.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    // One swipe = one step. A trackpad swipe ends in a long, fading tail of momentum events,
    // so after stepping we ignore that tail, but a new swipe (a reversal, a fresh burst of
    // energy, or a pause) unlocks immediately so repeated swipes keep working.
    let acc = 0;
    let locked = false;
    let lockedAt = 0;
    let lastAbs = 0;
    let lastSign = 0;
    let quiet = null;
    const onWheel = (e) => {
      const dx = e.shiftKey && e.deltaX === 0 ? e.deltaY : e.deltaX;
      if (!e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const abs = Math.abs(dx);
      const sign = Math.sign(dx);
      const now = performance.now();

      if (locked && now - lockedAt > 220) {
        const reversed = sign !== 0 && sign !== lastSign;
        const surge = abs > lastAbs * 1.5 + 8;
        if (reversed || surge) { locked = false; acc = 0; }
      }
      lastAbs = abs;
      lastSign = sign || lastSign;

      clearTimeout(quiet);
      quiet = setTimeout(() => { locked = false; acc = 0; lastAbs = 0; }, 90);
      if (locked) return;

      acc += dx;
      if (Math.abs(acc) > 30) {
        latest.current.onPick(latest.current.active + (acc > 0 ? 1 : -1));
        locked = true;
        lockedAt = now;
        acc = 0;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(quiet); };
  }, []);

  const offsetOf = (i) => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  return (
    <div
      ref={stage}
      style={{ touchAction: 'pan-y', overscrollBehaviorX: 'contain' }}
      className="relative mx-auto mt-10 h-[calc(var(--w)*1.78+2rem)] w-full select-none overflow-hidden [--w:230px] sm:[--w:300px] lg:[--w:350px]"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="YouTube Shorts"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onPick(active - 1);
        if (e.key === 'ArrowRight') onPick(active + 1);
      }}
      onPointerDown={(e) => { drag.current = e.clientX; }}
      onPointerUp={(e) => {
        if (drag.current === null) return;
        const dx = e.clientX - drag.current;
        drag.current = null;
        if (Math.abs(dx) > 50) onPick(active + (dx < 0 ? 1 : -1));
      }}
    >
      {ids.map((id, i) => {
        const d = offsetOf(i);
        const a = Math.abs(d);
        if (a > VISIBLE) return null;
        const side = Math.sign(d);
        // Each step back peeks out a little further than the one in front of it.
        const x = d === 0 ? 0 : side * (0.62 + (a - 1) * 0.27);
        const scale = 1 - a * 0.1;
        const center = d === 0;
        return (
          <div
            key={id}
            className="absolute left-1/2 top-4 aspect-[9/16] w-[var(--w)] transition-all duration-500 ease-out"
            style={{
              transform: `translateX(calc(-50% + var(--w) * ${x})) scale(${scale})`,
              zIndex: 20 - a,
              opacity: a === VISIBLE ? 0 : 1,
              pointerEvents: a === VISIBLE ? 'none' : 'auto',
            }}
          >
            <div
              ref={center ? centerEl : null}
              onMouseEnter={center ? () => { if (playing?.id !== id) onPlay(id, true); } : undefined}
              className={`relative h-full w-full overflow-hidden rounded-2xl bg-navy-deep ${center ? 'shadow-chunky-lg ring-1 ring-gold/50' : 'shadow-chunky'}`}
            >
              {center && playing?.id === id ? (
                <Player key={id} id={id} startMuted={playing.muted} />
              ) : (
                <button
                  onClick={() => (center ? onPlay(id, false) : onPick(i))}
                  aria-label={center ? 'Play YouTube Short' : 'Bring this Short to the front'}
                  className="group absolute inset-0"
                >
                  <img src={thumb(id)} alt="" loading="lazy" draggable="false" className="h-full w-full object-cover" />
                  {!center && <span className="absolute inset-0 bg-ivory-dark" style={{ opacity: Math.min(0.8, 0.22 * a + 0.12) }} />}
                  {center && (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />
                      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-deep shadow-chunky transition-transform group-hover:scale-110">
                        <Play className="ml-1 h-7 w-7 fill-current" />
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const YouTubeShorts = ({ shorts = [], channelUrl = '', variant = 'strip', limit = 0 }) => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(null); // { id, muted }
  const all = shorts.map(youtubeId).filter(Boolean);
  if (!all.length) return null;
  const ids = limit ? all.slice(0, limit) : all;
  const grid = variant === 'grid';

  const pick = (i) => { setActive((i + ids.length) % ids.length); setPlaying(null); };

  return (
    <section className="overflow-hidden bg-ivory-dark py-24 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col gap-6 sm:flex-row sm:items-end ${grid ? 'sm:justify-between' : 'items-center text-center sm:flex-col sm:items-center'}`}>
          <div>
            <h2 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl lg:text-5xl">Watch us in action</h2>
            <span className={`mt-6 block h-px w-16 bg-gold ${grid ? '' : 'mx-auto'}`} aria-hidden="true" />
          </div>
          {channelUrl && (
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-deep hover:text-goldtext">
              Visit our channel <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {grid ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto py-3 sm:flex-wrap sm:justify-center sm:overflow-visible">
            {ids.map((id) => <Short key={id} id={id} />)}
          </div>
        </div>
      ) : (
        <>
          <Coverflow ids={ids} active={active} onPick={pick} playing={playing} onPlay={(id, muted) => setPlaying({ id, muted })} />
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => pick(active - 1)} aria-label="Previous Short" className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-deep/20 bg-white text-navy-deep transition-colors hover:bg-navy-deep hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
            <span className="min-w-[4.5rem] text-center text-xs font-semibold tabular-nums text-ink/60">
              {String(active + 1).padStart(2, '0')} / {String(ids.length).padStart(2, '0')}
            </span>
            <button onClick={() => pick(active + 1)} aria-label="Next Short" className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-deep/20 bg-white text-navy-deep transition-colors hover:bg-navy-deep hover:text-white"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </>
      )}
    </section>
  );
};
