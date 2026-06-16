import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const stats = [
  { value: '8.59', label: 'CGPA', suffix: '', icon: '🎓', color: '#7c3aed' },
  { value: '4', label: 'Projects Built', suffix: '+', icon: '🚀', color: '#06b6d4' },
  { value: '4', label: 'Certifications', suffix: '', icon: '🏆', color: '#4f46e5' },
  { value: 'FS', label: 'Full Stack Dev', suffix: '', icon: '💻', color: '#7c3aed' },
];

function CountUp({ target, suffix }: { target: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [val, setVal] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const numeric = parseFloat(target);
    if (isNaN(numeric)) { setVal(target); return; }
    let start = 0;
    const duration = 1500;
    const step = duration / 60;
    const increment = numeric / (duration / step);
    const interval = setInterval(() => {
      start += increment;
      if (start >= numeric) { setVal(target); clearInterval(interval); }
      else setVal(Number.isInteger(numeric) ? Math.floor(start).toString() : start.toFixed(2));
    }, step);
    return () => clearInterval(interval);
  }, [isInView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="about" className="section-py parallax-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Parallax background orb */}
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', top: '-20%', right: '-10%' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', bottom: '10%', left: '-5%' }} />
      </motion.div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7c3aed', letterSpacing: '0.2em', textTransform: 'uppercase' }}>01 / About</span>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginTop: '0.5rem', lineHeight: 1.1 }}>
            <span style={{ color: '#f8fafc' }}>The Developer</span><br />
            <span className="gradient-text">Behind the Code</span>
          </h2>
        </motion.div>

        {/* Split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left: Profile image + bio */}
          <motion.div style={{ y: imgY }}>
            {/* Profile photo */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <div className="profile-ring" style={{ width: 200, height: 200 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#0a0a1a' }}>
                  <img src="/rosa.jpg" onError={(e)=>{(e.currentTarget as HTMLImageElement).src="/rosa.jpg"}} alt="Rosa Mystica" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }}>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.25rem' }}>
                I'm a Computer Science Engineering graduate from Thoothukudi, Tamil Nadu, passionate about building full-stack applications that solve real problems. My journey spans from crafting responsive React UIs to designing Node.js backends and integrating AI into practical tools.
              </p>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
                I've built an AI-powered medical chatbot during my internship, a live appointment booking system deployed on Netlify, and a Zoho-based productivity bot — all while maintaining a CGPA of 8.59.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {['Grace College of Engineering', 'B.E. Computer Science', 'Class of 2026', 'CGPA 8.59'].map(tag => (
                  <span key={tag} className="tech-badge">{tag}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Stats + quick facts */}
          <motion.div style={{ y: contentY }}>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {stats.map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * i + 0.4 }}
                  className="glass glass-hover"
                  style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem', fontWeight: 800, color: stat.color, marginBottom: '0.25rem' }}>
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick facts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.6 }}
              className="glass" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', color: '#7c3aed', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Facts</h3>
              {[
                ['📍', 'Location', 'Thoothukudi, Tamil Nadu'],
                ['🎓', 'Degree', 'B.E. Computer Science'],
                ['📅', 'Graduation', 'May 2026'],
                ['💼', 'Status', 'Open to Opportunities'],
                ['✉️', 'Email', 'rosaannie2004@gmail.com'],
              ].map(([icon, key, val]) => (
                <div key={key as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
                  <span style={{ color: '#475569', fontSize: '0.875rem' }}>{icon} {key}</span>
                  <span style={{ color: '#c4b5fd', fontSize: '0.875rem', fontFamily: 'JetBrains Mono, monospace' }}>{val}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
