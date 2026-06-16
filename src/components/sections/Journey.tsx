import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { journey } from '../../data';

// ─── Types ────────────────────────────────────────────────────────────────────
interface JourneyItem {
  year: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  tags?: string[];
  active?: boolean;
}

// ─── Small hook to detect mobile viewport ─────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}

// ─── Card with magnetic tilt + mouse spotlight ────────────────────────────────
function JourneyCard({
  item,
  isLeft,
  inView,
  delay,
  isMobile,
}: {
  item: JourneyItem;
  isLeft: boolean;
  inView: boolean;
  delay: number;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) return; // disable tilt/spotlight tracking on touch devices
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 6, y: dx * 6 });
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : isLeft ? -70 : 70, y: isMobile ? 30 : 0 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.34, 1.2, 0.64, 1] }}
      style={{
        display: 'flex',
        justifyContent: isMobile ? 'flex-start' : isLeft ? 'flex-end' : 'flex-start',
        width: '100%',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => {
          if (isMobile) return;
          setHovered(false);
          setTilt({ x: 0, y: 0 });
        }}
        style={{
          position: 'relative',
          background: 'rgba(17,17,24,0.9)',
          border: `1px solid ${item.active ? 'rgba(52,211,153,0.35)' : 'rgba(124,58,237,0.18)'}`,
          borderRadius: 16,
          padding: isMobile ? '16px 18px' : '20px 22px',
          maxWidth: isMobile ? '100%' : 340,
          width: '100%',
          cursor: 'default',
          backdropFilter: 'blur(10px)',
          transform: hovered
            ? `translateY(-4px) scale(1.02) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)',
          transition: hovered
            ? 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.5s ease, border-color 0.3s ease',
          boxShadow: hovered
            ? `0 24px 60px ${item.color}22, 0 0 0 1px ${item.color}20`
            : '0 4px 20px rgba(0,0,0,0.3)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        {/* Mouse spotlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${item.color}18 0%, transparent 55%)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }}
        />

        {/* Shimmer sweep on hover */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: '-100%',
              left: '-60%',
              width: '40%',
              height: '300%',
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
              transform: 'skewX(-20deg)',
              animation: 'sweep 0.5s ease forwards',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Connector line (hidden on mobile, since cards aren't side-aligned to the spine) */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              [isLeft ? 'right' : 'left']: 0,
              width: 30,
              height: 1,
              background: isLeft
                ? `linear-gradient(90deg, transparent, ${item.color}60)`
                : `linear-gradient(90deg, ${item.color}60, transparent)`,
            }}
          />
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', lineHeight: 1, filter: `drop-shadow(0 0 8px ${item.color})` }}>
            {item.icon}
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, Courier New, monospace',
              fontSize: '0.68rem',
              letterSpacing: '0.15em',
              padding: '3px 8px',
              borderRadius: 20,
              border: `1px solid ${item.color}40`,
              background: `${item.color}12`,
              color: item.color,
            }}
          >
            {item.year}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: isMobile ? '0.9rem' : '0.95rem',
            fontWeight: 700,
            color: '#f8fafc',
            marginBottom: 6,
            lineHeight: 1.3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {item.title}
        </h3>

        {/* Subtitle */}
        <p
          style={{
            color: '#64748b',
            fontSize: isMobile ? '0.78rem' : '0.8rem',
            lineHeight: 1.65,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {item.subtitle}
        </p>

        {/* Tag chips */}
        {item.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10, position: 'relative', zIndex: 1 }}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.62rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: '2px 7px',
                  borderRadius: 4,
                  background: `${item.color}12`,
                  color: item.color,
                  border: `1px solid ${item.color}28`,
                  letterSpacing: '0.05em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Active badge */}
        {item.active && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.62rem',
              color: '#34d399',
              fontFamily: 'JetBrains Mono, monospace',
              marginTop: 10,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#34d399',
                animation: 'blink 1.2s ease-in-out infinite',
              }}
            />
            Currently here
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineH = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '100%']);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const isMobile = useIsMobile();

  return (
    <>
      {/* Global keyframes — inject once */}
      <style>{`
        @keyframes sweep {
          0%   { left: -60%; opacity: 1; }
          100% { left: 130%; opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes nodePulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes gradientShimmer {
          0%   { background-position: 0%   50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      <section
        ref={ref}
        id="journey"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: isMobile ? '64px 0 80px' : '100px 0 120px',
        }}
      >
        {/* Parallax ambient bg */}
        <motion.div
          style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 0, pointerEvents: 'none' }}
        >
          <div
            style={{
              position: 'absolute',
              width: isMobile ? 500 : 900,
              height: isMobile ? 500 : 900,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
          {/* Subtle grid */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#7c3aed" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: isMobile ? '0 1.25rem' : '0 2rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: isMobile ? '3rem' : '5rem' }}
          >
            {/* Eyebrow with decorative lines */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: isMobile ? 24 : 40,
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #06b6d4)',
                }}
              />
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: isMobile ? '0.62rem' : '0.7rem',
                  color: '#06b6d4',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                02 / Journey
              </span>
              <div
                style={{
                  width: isMobile ? 24 : 40,
                  height: 1,
                  background: 'linear-gradient(90deg, #06b6d4, transparent)',
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(1.9rem, 8vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              <span style={{ color: '#f8fafc' }}>My </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #7c3aed)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShimmer 4s linear infinite',
                }}
              >
                Story So Far
              </span>
            </h2>

            <p
              style={{
                color: '#64748b',
                marginTop: 14,
                lineHeight: 1.7,
                fontSize: isMobile ? '0.85rem' : '0.95rem',
                maxWidth: 400,
                margin: '14px auto 0',
                padding: isMobile ? '0 0.5rem' : 0,
              }}
            >
              From a Computer Science student to a Full Stack Developer — every step has been intentional.
            </p>
          </motion.div>

          {/* ── Timeline ── */}
          <div style={{ position: 'relative' }}>
            {/* Animated spine */}
            <div
              style={{
                position: 'absolute',
                left: isMobile ? 18 : '50%',
                top: 0,
                bottom: 0,
                width: 2,
                transform: isMobile ? 'none' : 'translateX(-50%)',
                background: 'rgba(124,58,237,0.08)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  width: '100%',
                  height: lineH,
                  background: 'linear-gradient(180deg, #7c3aed, #06b6d4, #34d399)',
                  backgroundSize: '100% 300%',
                  animation: 'gradientShimmer 3s linear infinite',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
              {(journey as JourneyItem[]).map((item, i) => {
                const isLeft = i % 2 === 0;

                // ── Mobile layout: single column, node pinned to left spine ──
                if (isMobile) {
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '36px 1fr',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        minHeight: 80,
                      }}
                    >
                      {/* Node column */}
                      <div
                        style={{
                          gridColumn: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          position: 'relative',
                          paddingTop: 18,
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isInView ? { scale: 1, opacity: 1 } : {}}
                          transition={{
                            delay: i * 0.13 + 0.15,
                            duration: 0.5,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                          style={{ position: 'relative', zIndex: 1 }}
                        >
                          {/* Outer pulse rings */}
                          {[0, 1].map((ring) => (
                            <div
                              key={ring}
                              style={{
                                position: 'absolute',
                                inset: ring === 0 ? -5 : -10,
                                borderRadius: '50%',
                                border: `1.5px solid ${item.color}`,
                                opacity: 0,
                                animation: `nodePulse 2.5s ease-out ${ring * 0.5}s infinite`,
                              }}
                            />
                          ))}

                          {/* Core dot */}
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              background: item.color,
                              boxShadow: `0 0 18px ${item.color}99, 0 0 36px ${item.color}40`,
                              border: '2px solid var(--bg-primary, #0a0a0f)',
                              position: 'relative',
                              zIndex: 1,
                            }}
                          />
                        </motion.div>
                      </div>

                      {/* Card column */}
                      <div style={{ gridColumn: 2, minWidth: 0 }}>
                        <JourneyCard
                          item={item}
                          isLeft={isLeft}
                          inView={isInView}
                          delay={i * 0.13}
                          isMobile={true}
                        />
                      </div>
                    </div>
                  );
                }

                // ── Desktop / tablet layout: original alternating two-column ──
                return (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 60px 1fr',
                      alignItems: 'center',
                      gap: '1.5rem',
                      minHeight: 100,
                    }}
                  >
                    {/* Left slot */}
                    <div style={{ gridColumn: 1 }}>
                      {isLeft && (
                        <JourneyCard
                          item={item}
                          isLeft={true}
                          inView={isInView}
                          delay={i * 0.13}
                          isMobile={false}
                        />
                      )}
                    </div>

                    {/* Center node */}
                    <div
                      style={{
                        gridColumn: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{
                          delay: i * 0.13 + 0.25,
                          duration: 0.5,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        style={{ position: 'relative', zIndex: 1 }}
                      >
                        {/* Outer pulse rings */}
                        {[0, 1].map((ring) => (
                          <div
                            key={ring}
                            style={{
                              position: 'absolute',
                              inset: ring === 0 ? -7 : -14,
                              borderRadius: '50%',
                              border: `1.5px solid ${item.color}`,
                              opacity: 0,
                              animation: `nodePulse 2.5s ease-out ${ring * 0.5}s infinite`,
                            }}
                          />
                        ))}

                        {/* Core dot */}
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: item.color,
                            boxShadow: `0 0 24px ${item.color}99, 0 0 48px ${item.color}40`,
                            border: '3px solid var(--bg-primary, #0a0a0f)',
                            position: 'relative',
                            zIndex: 1,
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Right slot */}
                    <div style={{ gridColumn: 3 }}>
                      {!isLeft && (
                        <JourneyCard
                          item={item}
                          isLeft={false}
                          inView={isInView}
                          delay={i * 0.13}
                          isMobile={false}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}