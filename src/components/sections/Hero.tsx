import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiGithub, FiLinkedin, FiArrowDown, FiExternalLink } from 'react-icons/fi';
import { useTypewriter } from '../../hooks/useTypewriter';
import ParticleCanvas from '../effects/ParticleCanvas';

const floatingIcons = [
  { icon: '⚛️', label: 'React', x: '8%', y: '20%', size: 48, delay: 0 },
  { icon: '🟢', label: 'Node.js', x: '88%', y: '25%', size: 44, delay: 0.5 },
  { icon: '🐍', label: 'Python', x: '5%', y: '65%', size: 42, delay: 1 },
  { icon: '🤖', label: 'AI', x: '92%', y: '60%', size: 46, delay: 1.5 },
  { icon: '🍃', label: 'MongoDB', x: '15%', y: '85%', size: 40, delay: 0.8 },
  { icon: '☕', label: 'Java', x: '85%', y: '80%', size: 40, delay: 1.2 },
  { icon: '⚡', label: 'JS', x: '50%', y: '88%', size: 38, delay: 0.3 },
];

const roles = ['Software Developer','React & Node.js Engineer', 'AI Solutions Builder','Full Stack Developer', 'Problem Solver'];

const nameLetters = 'Rosa Mystica'.split('');

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);

  const typedRole = useTypewriter(roles, 70, 2000, 35);

  // Mouse glow
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px';
        glowRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={ref} id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop:'5rem' }}>
      
      {/* Mouse glow */}
      <div ref={glowRef} style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0, transition: 'left 0.15s ease, top 0.15s ease' }} />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Aurora blobs — parallax layer 1 */}
      <motion.div style={{ position: 'absolute', inset: 0, y: y1, zIndex: 0 }}>
        <div className="aurora-blob" style={{ width: 600, height: 600, background: 'rgba(124,58,237,0.18)', top: '5%', left: '-10%' }} />
        <div className="aurora-blob" style={{ width: 500, height: 500, background: 'rgba(6,182,212,0.12)', top: '10%', right: '-5%', animationDelay: '4s' }} />
      </motion.div>

      {/* Grid — parallax layer 2 */}
      <motion.div className="grid-bg" style={{ position: 'absolute', inset: 0, y: y2, zIndex: 0, opacity: 0.5 }} />

      {/* Floating tech icons — parallax layer 3 */}
      <motion.div style={{ position: 'absolute', inset: 0, y: y3, zIndex: 1 }}>
        {floatingIcons.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: item.delay + 1, duration: 0.6 }}
            style={{
              position: 'absolute', left: item.x, top: item.y,
              fontSize: item.size,
              animation: `floatY ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
              filter: 'drop-shadow(0 0 12px rgba(124,58,237,0.4))',
            }}
            title={item.label}
          >{item.icon}</motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '2rem', maxWidth: 900, opacity, scale }}>
        
        {/* Availability badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.2rem', borderRadius: 9999, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', marginBottom: '2rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#67e8f9', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>Available for opportunities · Any Mode · Tamil Nadu, India</span>
        </motion.div>

        {/* Animated name */}
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2rem, 10vw, 7.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          <div style={{ overflow: 'hidden' }}>
            {nameLetters.map((letter, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: 60, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  display: 'inline-block',
                  background: letter === ' ' ? 'none' : 'linear-gradient(135deg, #c4b5fd 0%, #67e8f9 100%)',
                  WebkitBackgroundClip: letter === ' ' ? 'none' : 'text',
                  WebkitTextFillColor: letter === ' ' ? 'transparent' : 'transparent',
                  marginRight: letter === ' ' ? '0.3em' : '0',
                }}
              >{letter === ' ' ? '\u00A0' : letter}</motion.span>
            ))}
          </div>
        </h1>

        {/* Typewriter role */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.5 }}
          style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontFamily: 'Sora, sans-serif', fontWeight: 600, color: '#94a3b8', marginBottom: '1.5rem', minHeight: '2.5rem' }}>
          <span style={{ color: '#7c3aed' }}>// </span>
          <span style={{ color: '#e2e8f0' }}>{typedRole}</span>
          <span style={{ animation: 'scrollBounce 1s ease-in-out infinite', color: '#7c3aed' }}>|</span>
        </motion.div>

        {/* Tagline */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.6 }}
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#94a3b8', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Building scalable web applications and AI-powered solutions that make a difference.
        </motion.p>

        {/* CTA Buttons */}
        {/* CTA Buttons */}
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.6 }}
  style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
  
  {/* ✅ NEW: Hire Me — Primary CTA */}
  <a href="#contact"
    style={{ padding: '0.875rem 2rem', borderRadius: 9999, background: 'linear-gradient(135deg, #22c55e, #06b6d4)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', boxShadow: '0 0 30px rgba(34,197,94,0.45)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(34,197,94,0.65)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(34,197,94,0.45)'; }}
  >🚀 Hire Me</a>

  {/* View Projects */}
  <a href="#projects"
    style={{ padding: '0.875rem 2rem', borderRadius: 9999, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 0 30px rgba(124,58,237,0.45)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(124,58,237,0.65)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(124,58,237,0.45)'; }}
  >View Projects <FiExternalLink /></a>

  {/* Download Resume */}
  <a href="/Rosa_Mystica__M.pdf" download
    style={{ padding: '0.875rem 2rem', borderRadius: 9999, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.3s ease' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(124,58,237,0.2)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
  >Download Resume</a>

</motion.div>

        {/* Social links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {[
            { href: 'https://github.com/rosamystica14', icon: <FiGithub />, label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/rosa-mystica-061281347/', icon: <FiLinkedin />, label: 'LinkedIn' },
          ].map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#c4b5fd'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >{s.icon} {s.label}</a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>SCROLL</span>
          <div style={{ animation: 'scrollBounce 1.5s ease-in-out infinite' }}><FiArrowDown style={{ fontSize: '1.2rem', color: '#7c3aed' }} /></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
