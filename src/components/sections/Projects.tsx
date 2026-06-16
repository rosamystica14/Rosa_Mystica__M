import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import { FiExternalLink, FiGithub, FiLinkedin, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { projects } from '../../data';

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  featured:     { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.4)',  text: '#67e8f9' },
  internship:   { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.4)', text: '#c4b5fd' },
  prototype:    { bg: 'rgba(79,70,229,0.12)',  border: 'rgba(79,70,229,0.4)',  text: '#a5b4fc' },
  'ai-prototype':{ bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', text: '#fcd34d' },
};

// ─── Scroll-Driven 3D Card Carousel ──────────────────────────────────────────
// Mirrors the GSAP scroll-driven stack effect — each card travels from deep
// behind (z=-500) forward then flies off downward, driven by the card's own
// scroll position rather than page scroll.

// ─── Scroll-Driven 3D Stack Carousel ─────────────────────────────────────────
// Each card in the thumbnail lives in a 3D perspective stage.
// Top card is fully visible; cards below peek out scaled + shifted.
// Swipe/click the top card to dismiss it (fly-off down with rotateX).
// Auto-cycles every 2.5 s so the animation is always visible.

function ScrollCarousel3D({
  screenshots,
  onOpenLightbox,
}: {
  screenshots: string[];
  onOpenLightbox: () => void;
}) {
  // current = index of the card currently on top (starts at last, counts down)
  const [current, setCurrent] = useState(screenshots.length - 1);
  // dismissed cards (fly-off animation plays, then they go to back of stack)
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const total = screenshots.length;

  // Auto-advance every 2.5 s when not hovered
  useEffect(() => {
    if (isHovered || total === 0) return;
    const id = setInterval(() => {
      advance();
    }, 2500);
    return () => clearInterval(id);
  }, [isHovered, current, dismissed, total]);

  const advance = useCallback(() => {
    setDismissed(prev => {
      const next = new Set(prev);
      next.add(current);
      return next;
    });
    // after fly-off, reset after 600ms so dismissed set doesn't grow forever
    const nextIdx = current - 1 < 0 ? total - 1 : current - 1;
    setTimeout(() => {
      setDismissed(new Set());
      setCurrent(nextIdx);
    }, 600);
  }, [current, total]);

  // drag / swipe
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 35) advance();
  };

  if (total === 0) return null;

  // Render all cards; each gets a position relative to `current`
  // pos=0 → top card; pos=1 → one below; etc.
  return (
    <div
      style={{
        position: 'relative',
        height: 168,
        perspective: '600px',
        perspectiveOrigin: '50% 40%',
        cursor: 'grab',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {screenshots.map((src, i) => {
        const isDismissed = dismissed.has(i);
        // How deep below the top card is this card?
        // pos 0 = top, pos 1 = second, etc. (wraps around)
        const pos = ((current - i) % total + total) % total;
        const isTopCard = pos === 0;

        return (
          <StackCard
            key={i}
            src={src}
            pos={pos}
            total={total}
            isDismissed={isDismissed}
            isTopCard={isTopCard}
            onClick={isTopCard ? onOpenLightbox : undefined}
          />
        );
      })}

      {/* Gradient overlay — bottom fade */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,5,15,0.75) 0%, transparent 45%)',
      }} />

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: '0.5rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: '5px', zIndex: 110, pointerEvents: 'none',
      }}>
        {screenshots.map((_, i) => (
          <div key={i} style={{
            width: i === current ? 18 : 6,
            height: 6,
            borderRadius: 9999,
            background: i === current ? '#7c3aed' : 'rgba(255,255,255,0.25)',
            transition: 'all 0.35s ease',
          }} />
        ))}
      </div>

      {/* Screenshot count */}
      <div style={{
        position: 'absolute', top: '0.5rem', right: '0.6rem',
        background: 'rgba(0,0,0,0.55)', borderRadius: 9999,
        padding: '0.18rem 0.6rem', fontSize: '0.68rem',
        color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace',
        zIndex: 110, pointerEvents: 'none',
      }}>
        {current + 1} / {total}
      </div>
    </div>
  );
}

// StackCard — single card in the perspective stage
// pos=0 → top (full brightness, rotateX slight forward tilt)
// pos=1,2,3 → each one deeper behind (scaled down, shifted up, darker)
// isDismissed → flies off downward with back.in easing
function StackCard({
  src,
  pos,
  total,
  isDismissed,
  isTopCard,
  onClick,
}: {
  src: string;
  pos: number;       // 0=top, 1=second from top, etc.
  total: number;
  isDismissed: boolean;
  isTopCard: boolean;
  onClick?: () => void;
}) {
  const MAX_VISIBLE = 4;
  const isVisible = pos < MAX_VISIBLE;

  // Per-depth visual values — mirrors GSAP stack
  const scaleVal    = 1 - pos * 0.055;
  const translateY  = -pos * 10;   // peek upward (cards below slide up slightly)
  const translateZ  = -pos * 55;   // depth in 3D
  const rotateX     = pos === 0 ? -4 : 2 + pos * 1.5;  // top tips toward viewer
  const brightness  = Math.max(0.35, 1 - pos * 0.18);

  // Radial gradient: back-lit for deep cards, front-lit for top
  const bgGradient = pos === 0
    ? 'radial-gradient(ellipse at 150px 120px, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)'
    : 'radial-gradient(ellipse at 2500px -400px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 60%)';

  const stackTransition: Transition = {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  };
  const dismissTransition: Transition = {
    duration: 0.52,
    ease: [0.36, 0, 0.66, -0.56] as [number, number, number, number],
  };

  const variants: Variants = {
    visible: {
      opacity: isVisible ? 1 : 0,
      scale: scaleVal,
      y: translateY,
      z: translateZ,
      rotateX,
      filter: `brightness(${brightness})`,
      transition: stackTransition,
    },
    dismissed: {
      opacity: 0,
      scale: scaleVal * 0.9,
      y: '120%',
      z: translateZ,
      rotateX: -10,
      filter: 'brightness(0.3)',
      transition: dismissTransition,
    },
  };

  return (
    <motion.div
      variants={variants}
      animate={isDismissed ? 'dismissed' : 'visible'}
      initial="visible"
      onClick={isTopCard ? onClick : undefined}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: total - pos,
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 120% -80px',   // pivot below+behind — same arc as GSAP
        borderRadius: 10,
        overflow: 'hidden',
        cursor: isTopCard ? 'pointer' : 'default',
        pointerEvents: isTopCard ? 'auto' : 'none',
        willChange: 'transform, opacity',
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          pointerEvents: 'none',
        }}
      />
      {/* Light-source gradient overlay — shifts as card comes forward */}
      <div style={{
        position: 'absolute', inset: 0,
        background: bgGradient,
        transition: 'background 0.5s ease',
      }} />
    </motion.div>
  );
}

// ─── Chat Preview — fallback visual for cards with no screenshots ───────────
// Drops into the same thumbnail slot as ScrollCarousel3D so cards like the
// AI Medical Chatbot (no screenshots array) still get a top visual that
// mirrors the layout rhythm of the other project cards.
function ChatPreview() {
  return (
    <div
      style={{
        position: 'relative',
        height: 168,
        padding: '1rem 1.1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(6,182,212,0.04))',
        overflow: 'hidden',
      }}
    >
      {/* bot message */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: '#fff',
          }}
        >
          AI
        </div>
        <div
          style={{
            maxWidth: '78%',
            padding: '0.5rem 0.8rem',
            borderRadius: '0.9rem 0.9rem 0.9rem 0.2rem',
            background: 'rgba(124,58,237,0.14)',
            border: '1px solid rgba(124,58,237,0.25)',
            color: '#c4b5fd',
            fontSize: '0.74rem',
            lineHeight: 1.4,
          }}
        >
          Hi! Describe your symptoms and I'll help assess them.
        </div>
      </div>

      {/* user message */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            maxWidth: '72%',
            padding: '0.5rem 0.8rem',
            borderRadius: '0.9rem 0.9rem 0.2rem 0.9rem',
            background: 'rgba(6,182,212,0.14)',
            border: '1px solid rgba(6,182,212,0.3)',
            color: '#67e8f9',
            fontSize: '0.74rem',
            lineHeight: 1.4,
          }}
        >
          I've had a headache and mild fever since yesterday.
        </div>
      </div>

      {/* bot typing indicator */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: '#fff',
          }}
        >
          AI
        </div>
        <div
          style={{
            display: 'flex',
            gap: '0.3rem',
            padding: '0.55rem 0.9rem',
            borderRadius: '0.9rem 0.9rem 0.9rem 0.2rem',
            background: 'rgba(124,58,237,0.14)',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#c4b5fd',
                animation: `chatTypingDot 1.2s ${i * 0.18}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes chatTypingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>

      {/* bottom fade — matches ScrollCarousel3D's gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(5,5,15,0.55) 0%, transparent 55%)',
        }}
      />
    </div>
  );
}

// ─── 3-D Carousel Lightbox ────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function use3DTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rotX = 0, rotY = 0;
    let targetX = 0, targetY = 0;
    let rafId: number;
    let lerpAmt = 0.06;

    const tick = () => {
      rotX = lerp(rotX, targetX, lerpAmt);
      rotY = lerp(rotY, targetY, lerpAmt);
      el.style.setProperty('--tilt-x', `${rotX.toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${rotY.toFixed(2)}deg`);
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      lerpAmt = 0.1;
      const rect = el.getBoundingClientRect();
      const ox = e.clientX - rect.left - rect.width / 2;
      const oy = e.clientY - rect.top - rect.height / 2;
      targetX = -(oy / (Math.PI * 4));
      targetY = ox / (Math.PI * 3);
    };

    const onLeave = () => {
      lerpAmt = 0.06;
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [ref]);
}

type SlideState = 'current' | 'next' | 'previous' | 'hidden';

function CarouselSlide({
  src,
  state,
  onClick,
}: {
  src: string;
  state: SlideState;
  onClick?: () => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  use3DTilt(state === 'current' ? innerRef : { current: null });

  const transforms: Record<SlideState, string> = {
    current:  'perspective(1000px) translate(-50%, -50%) rotateY(0deg)   scale(1.15)',
    next:     'perspective(1000px) translate(calc(-50% + min(52vw, 450px)), -50%) rotateY(-45deg) scale(0.85)',
    previous: 'perspective(1000px) translate(calc(-50% - min(52vw, 450px)), -50%) rotateY(45deg)  scale(0.85)',
    hidden:   'perspective(1000px) translate(-50%, -50%) rotateY(0deg)   scale(0.6)',
  };

  const zIndex = state === 'current' ? 20 : 10;
  const brightness = state === 'current' ? 0.9 : 0.45;

  return (
    <div
      onClick={state === 'next' || state === 'previous' ? onClick : undefined}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(46vw, 400px)',
        aspectRatio: '16 / 10',
        transform: transforms[state],
        transition: 'transform 750ms cubic-bezier(0.4,0,0.2,1), opacity 500ms ease, box-shadow 500ms ease',
        zIndex,
        opacity: state === 'hidden' ? 0 : 1,
        pointerEvents: state === 'hidden' ? 'none' : 'auto',
        cursor: state === 'next' || state === 'previous' ? 'pointer' : 'default',
        borderRadius: '0.85rem',
        overflow: 'hidden',
        boxShadow:
          state === 'current'
            ? '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.4)'
            : '0 10px 40px rgba(0,0,0,0.4)',
      }}
    >
      <div
        ref={state === 'current' ? innerRef : undefined}
        style={{
          width: '100%',
          height: '100%',
          transform:
            state === 'current'
              ? 'rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))'
              : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: `brightness(${brightness})`,
            transition: 'filter 750ms ease',
            userSelect: 'none',
          }}
        />
      </div>
    </div>
  );
}

function Carousel3D({ screenshots, onClose }: { screenshots: string[]; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const total = screenshots.length;

  const go = useCallback(
    (dir: 1 | -1) => setCurrent(i => (i + dir + total) % total),
    [total]
  );

  const getState = (i: number): SlideState => {
    if (i === current) return 'current';
    if (i === (current + 1) % total) return 'next';
    if (i === (current - 1 + total) % total) return 'previous';
    return 'hidden';
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(12px)',
        padding: '2rem',
        gap: '2.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage: `url(${screenshots[current]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(28px) brightness(0.15)',
          transition: 'background-image 700ms ease',
          zIndex: 0,
        }}
      />

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          width: 40,
          height: 40,
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          zIndex: 10,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
      >
        <FiX />
      </button>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 960,
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => go(-1)}
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.4)',
            color: '#c4b5fd',
            width: 44,
            height: 44,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            zIndex: 30,
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.35)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)')}
        >
          <FiChevronLeft />
        </button>

        <div
          style={{
            flex: 1,
            position: 'relative',
            height: 'min(42vw, 320px)',
            perspective: '1200px',
            overflow: 'visible',
          }}
        >
          {screenshots.map((src, i) => (
            <CarouselSlide
              key={i}
              src={src}
              state={getState(i)}
              onClick={() => {
                const s = getState(i);
                if (s === 'next') go(1);
                if (s === 'previous') go(-1);
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.4)',
            color: '#c4b5fd',
            width: 44,
            height: 44,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            zIndex: 30,
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.35)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)')}
        >
          <FiChevronRight />
        </button>
      </div>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#64748b' }}>
          {current + 1} / {total}
        </span>
        <div style={{ display: 'flex', gap: '0.45rem' }}>
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 26 : 8,
                height: 8,
                borderRadius: 9999,
                background: i === current ? '#7c3aed' : 'rgba(124,58,237,0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Rest of components (unchanged) ──────────────────────────────────────────

function FeaturedProject({ project }: { project: typeof projects[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
      style={{ marginBottom: '5rem', background: 'rgba(10,10,26,0.7)', borderRadius: '1.5rem', border: '1px solid rgba(6,182,212,0.2)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #06b6d4, #7c3aed, transparent)' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0 }}>
        <div style={{ padding: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ padding: '0.35rem 1rem', borderRadius: 9999, fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', background: statusColors.featured.bg, border: `1px solid ${statusColors.featured.border}`, color: statusColors.featured.text }}>★ FEATURED PROJECT</span>
          </div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2, marginBottom: '1rem' }}>{project.title}</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{project.description}</p>
          
          <ul style={{ listStyle: 'none', marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {project.features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', flexShrink: 0 }} />{f}
              </li>
            ))}
          </ul>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {project.tech.map(t => <span key={t} className="tech-badge">{t}</span>)}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 9999, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 0 25px rgba(124,58,237,0.4)', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(124,58,237,0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(124,58,237,0.4)'; }}
              ><FiExternalLink /> Live Demo</a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 9999, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              ><FiGithub /> GitHub</a>
            )}
            {project.linkedinPost && (
  <a href={project.linkedinPost} target="_blank" rel="noopener noreferrer"
    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 9999, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.3s ease' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
  ><FiLinkedin /> LinkedIn Post</a>
)}
          </div>
        </div>

        <motion.div style={{ y: imgY, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="browser-mockup" style={{ width: '100%' }}>
            <div className="browser-bar">
              <div className="browser-dot" style={{ background: '#ff5f57' }} />
              <div className="browser-dot" style={{ background: '#ffc32d' }} />
              <div className="browser-dot" style={{ background: '#28c840' }} />
              <div style={{ flex: 1, background: 'rgba(124,58,237,0.1)', borderRadius: 9999, padding: '0.25rem 0.75rem', marginLeft: '0.5rem', fontSize: '0.72rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>glowbeautyabs.netlify.app</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(6,182,212,0.03))', minHeight: 220, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
  {/* Mini calendar strip */}
  <div style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
    {['M','T','W','T','F','S','S'].map((d, i) => (
      <div key={i} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
        padding: '0.4rem 0', borderRadius: 8,
        background: i === 3 ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(124,58,237,0.08)',
        border: i === 3 ? 'none' : '1px solid rgba(124,58,237,0.12)',
      }}>
        <span style={{ fontSize: '0.6rem', color: i === 3 ? 'rgba(255,255,255,0.85)' : '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{d}</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: i === 3 ? '#fff' : '#94a3b8' }}>{12 + i}</span>
      </div>
    ))}
  </div>

  {/* Stat cards */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
    {[
      { label: 'Today\u2019s Bookings', value: '12', color: '#67e8f9' },
      { label: 'Pending', value: '3', color: '#fcd34d' },
      { label: 'Revenue', value: '$480', color: '#a5b4fc' },
      { label: 'Slots Left', value: '5', color: '#c4b5fd' },
    ].map((stat) => (
      <div key={stat.label} style={{ height: 60, background: 'rgba(124,58,237,0.1)', borderRadius: 8, border: '1px solid rgba(124,58,237,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 0.85rem', gap: '0.15rem' }}>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: stat.color, fontFamily: 'Sora, sans-serif' }}>{stat.value}</span>
        <span style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{stat.label}</span>
      </div>
    ))}
  </div>

  <div style={{ width: '70%', height: 10, background: 'rgba(6,182,212,0.2)', borderRadius: 6, alignSelf: 'center' }} />
  <div style={{ padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: 9999, color: '#fff', fontSize: '0.75rem', fontWeight: 600, alignSelf: 'center' }}>Book Appointment</div>
</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── ProjectCard — thumbnail area now falls back to ChatPreview when there
// are no screenshots, otherwise behaves exactly as before ───────────────────
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [lightbox, setLightbox] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const sc = statusColors[project.statusType] || statusColors.prototype;
  const hasScreenshots = project.screenshots.length > 0;

  return (
    <>
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.1 }}
        className="glass glass-hover"
        style={{ borderRadius: '1.25rem', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ height: 2, background: `linear-gradient(90deg, ${sc.border.replace('0.4', '1')}, transparent)` }} />

        {/* Thumbnail: screenshot stack if available, otherwise chat preview */}
        <div style={{ position: 'relative', borderRadius: 0, overflow: 'hidden' }}>
          {hasScreenshots ? (
            <ScrollCarousel3D
              screenshots={project.screenshots}
              onOpenLightbox={() => setLightbox(true)}
            />
          ) : (
            <ChatPreview />
          )}
        </div>

        <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ padding: '0.3rem 0.875rem', borderRadius: 9999, fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{project.status.toUpperCase()}</span>
          </div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>{project.title}</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem', flex: 1 }}>{project.description}</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {project.tech.map(t => <span key={t} className="tech-badge" style={{ fontSize: '0.7rem' }}>{t}</span>)}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {project.linkedinPost && (
              <a href={project.linkedinPost} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: 9999, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              ><FiLinkedin /> LinkedIn Post</a>
            )}
            {hasScreenshots && (
              <button onClick={() => setLightbox(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: 9999, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#67e8f9', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >{project.statusType === 'ai-prototype' ? 'Preview Design' : 'View Screenshots'}</button>
            )}
            {project.statusType === 'internship' && (
              <span style={{ padding: '0.6rem 1.25rem', borderRadius: 9999, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#94a3b8', fontSize: '0.8rem' }}>Demo on Request</span>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox && hasScreenshots && (
          <Carousel3D
            screenshots={project.screenshots}
            onClose={() => setLightbox(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} id="projects" className="section-py parallax-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 0, pointerEvents: 'none' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', top: '20%', right: '-10%' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', bottom: '10%', left: '-5%' }} />
      </motion.div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7c3aed', letterSpacing: '0.2em', textTransform: 'uppercase' }}>03 / Projects</span>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginTop: '0.5rem', lineHeight: 1.1 }}>
            <span className="gradient-text">Featured </span>
            <span style={{ color: '#f8fafc' }}>Work</span>
          </h2>
        </motion.div>

        <FeaturedProject project={projects[0]} />

        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2rem', letterSpacing: '0.05em' }}>
          More Projects <span style={{ color: '#475569' }}>— 03</span>
        </motion.h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.slice(1).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}