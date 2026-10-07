import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Compass, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="bg-navy-deep text-ivory min-h-screen flex items-center justify-center p-4 text-center bg-maritime-pattern">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center mx-auto border-2 border-terracotta animate-pulse">
          <Anchor className="w-10 h-10" />
        </div>

        <span className="badge-solid bg-gold text-navy-deep">Error 404 • Ship Off Course</span>

        <h1 className="font-serif text-4xl font-extrabold text-white">
          Navigational Coordinates Not Found
        </h1>

        <p className="text-xs text-ivory/80 leading-relaxed">
          The page you are trying to reach seems to have drifted away or does not exist on our nautical charts.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-hover text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-terracotta transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Steer Back To Academy Harbor</span>
        </Link>
      </div>
    </div>
  );
};
