import { useEffect, useRef, useState } from 'react';

export const useContainerWidth = (breakpoints) => {
  const ref = useRef(null);
  const [widthsState, setWidthsState] = useState(() =>
    breakpoints.reduce((acc, bp) => ({ ...acc, [bp]: false }), {})
  );

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;

      const newStates = breakpoints.reduce((acc, bp) => {
        acc[bp] = width < bp;
        return acc;
      }, {});

      // Checking if the new values ​​are really different
      const isChanged = breakpoints.some(bp => newStates[bp] !== widthsState[bp]);

      if (isChanged) {
        setWidthsState(newStates);
      }
    });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [breakpoints, widthsState]);

  return { ref, widthsState };
};
