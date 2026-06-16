import { useEffect, useRef } from 'react';

export function useMouseGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const glow = document.getElementById('mouse-glow') as HTMLDivElement;
    glowRef.current = glow;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const dot = document.querySelector<HTMLDivElement>('.cursor-dot');
      if (dot) { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; }
    };

    let ringX = 0, ringY = 0;
    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (glow) {
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
      }
      const ring = document.querySelector<HTMLDivElement>('.cursor-ring');
      if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'; }
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => document.querySelector('.cursor-ring')?.classList.add('hovering');
    const onLeave = () => document.querySelector('.cursor-ring')?.classList.remove('hovering');

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    raf = requestAnimationFrame(animate);
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
}
