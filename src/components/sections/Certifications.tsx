import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { certifications } from '../../data';

const allCerts = [...certifications, ...certifications, ...certifications, ...certifications];

function CertCard({ cert }: { cert: typeof certifications[0] }) {
  return (
    <div style={{
      minWidth: 280, padding: '1.5rem 2rem', borderRadius: '1rem', margin: '0 0.75rem',
      background: 'rgba(10,10,26,0.8)', border: `1px solid ${cert.color}30`,
      boxShadow: `0 4px 30px ${cert.color}15`,
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
      transition: 'all 0.4s ease', flexShrink: 0,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${cert.color}60`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px ${cert.color}25`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${cert.color}30`; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 30px ${cert.color}15`; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.6rem', background: `${cert.color}20`, border: `1px solid ${cert.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏅</div>
        <div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>{cert.name}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: cert.color, marginTop: '0.2rem' }}>{cert.issuer}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: '0.7rem', color: '#22c55e', fontFamily: 'JetBrains Mono, monospace' }}>Verified</span>
      </div>
    </div>
  );
}

export default function Certifications() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="certifications" className="section-py parallax-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      </motion.div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 2rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7c3aed', letterSpacing: '0.2em', textTransform: 'uppercase' }}>05 / Certifications</span>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginTop: '0.5rem' }}>
            <span style={{ color: '#f8fafc' }}>Verified </span>
            <span className="gradient-text">Expertise</span>
          </h2>
        </motion.div>

        {/* Row 1: Left to right */}
        <div style={{ overflow: 'hidden', marginBottom: '1.5rem', padding: '0.5rem 0', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
          <div className="marquee-left" style={{ display: 'flex', width: 'max-content' }}>
            {allCerts.map((c, i) => <CertCard key={`a${i}`} cert={c} />)}
          </div>
        </div>

        {/* Row 2: Right to left */}
        <div style={{ overflow: 'hidden', padding: '0.5rem 0', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
          <div className="marquee-right" style={{ display: 'flex', width: 'max-content' }}>
            {[...allCerts].reverse().map((c, i) => <CertCard key={`b${i}`} cert={c} />)}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '3rem', padding: '0 2rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em' }}>4 certifications · Infosys & AL-Salaam Institution</span>
        </motion.div>
      </div>
    </section>
  );
}
