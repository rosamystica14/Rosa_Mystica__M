import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { skills } from '../../data';

const categoryColors: Record<string, string> = {
  Programming: '#7c3aed',
  Frontend: '#06b6d4',
  Backend: '#4f46e5',
  Database: '#059669',
  'AI & GenAI': '#f59e0b',
};

export default function Skills() {
  const [active, setActive] = useState('Programming');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const categories = Object.keys(skills);
  const activeSkills = skills[active as keyof typeof skills] || [];

  return (
    <section ref={ref} id="skills" className="section-py parallax-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 0, pointerEvents: 'none' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.35 }} />
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${categoryColors[active]}18 0%, transparent 70%)`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', transition: 'background 0.5s ease' }} />
      </motion.div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#06b6d4', letterSpacing: '0.2em', textTransform: 'uppercase' }}>04 / Skills</span>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginTop: '0.5rem' }}>
            <span style={{ color: '#f8fafc' }}>Technical </span>
            <span className="gradient-text">Arsenal</span>
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '1rem', maxWidth: 480, margin: '1rem auto 0', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Technologies I use to build, scale, and ship — from UI to AI.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              style={{
                padding: '0.6rem 1.4rem', borderRadius: 9999, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Sora, sans-serif', transition: 'all 0.35s ease',
                background: active === cat ? `${categoryColors[cat]}25` : 'rgba(15,15,36,0.7)',
                border: `1px solid ${active === cat ? categoryColors[cat] : 'rgba(124,58,237,0.2)'}`,
                color: active === cat ? categoryColors[cat] : '#94a3b8',
                boxShadow: active === cat ? `0 0 20px ${categoryColors[cat]}40` : 'none',
                transform: active === cat ? 'translateY(-1px)' : 'none',
              }}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skill cards */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {activeSkills.map((skill, i) => (
              <motion.div key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="skill-card glass"
                style={{ padding: '1.75rem 1rem', borderRadius: '1rem', textAlign: 'center', cursor: 'default', position: 'relative', overflow: 'hidden' }}>
                {/* Glow on hover via CSS class */}
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', lineHeight: 1 }}>{skill.icon}</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{skill.name}</div>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '1rem', background: `radial-gradient(circle at center, ${categoryColors[active]}10, transparent 70%)`, opacity: 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }} className="skill-inner-glow" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Skill count */}
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em' }}>
            {activeSkills.length} skills in {active} · {categories.reduce((a, c) => a + (skills[c as keyof typeof skills]?.length || 0), 0)} total
          </span>
        </motion.div>
      </div>
    </section>
  );
}
