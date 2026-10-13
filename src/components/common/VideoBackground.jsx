export const VideoBackground = ({ overlay = 'bg-navy-deep/70' }) => (
  <>
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src="/ocean-bg.mp4"
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
    />
    <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
  </>
);
