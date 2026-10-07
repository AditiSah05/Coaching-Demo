import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useScrollReveal = (options = { once: true, margin: "-50px" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, options);
  
  return { ref, isInView };
};
