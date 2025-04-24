import { useState, useEffect } from "react";

export function useElementCompressed(ref, maxWidth) {
  const [isCompressed, setIsCompressed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const compressed = width < maxWidth;

        setIsCompressed(prev => {
          if (prev !== compressed) {
            return compressed;
          }
          return prev;
        });
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [ref, maxWidth]);

  return isCompressed;
}
