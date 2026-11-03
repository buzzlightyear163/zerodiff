import { useEffect } from 'react';

/** Tonar in `.reveal`-element när de kommer in i bild (som referensen). */
export function useReveal(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [key]);
}

/** Sätter dokumenttitel som i referensen: "Sida | Varumärke". */
export function useTitle(title: string | null, brand: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${brand}` : brand;
  }, [title, brand]);
}
