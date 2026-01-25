import { useEffect, useState } from "react";

export default function useResizeObserver(ref) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (!entries.length) return;
      setDimensions(entries[0].contentRect);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return dimensions;
}
