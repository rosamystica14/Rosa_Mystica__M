
import { FiGithub, FiLinkedin, FiArrowUp, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{ position: 'relative', borderTop: '1px solid rgba(124,58,237,0.15)', background: 'rgba(5,5,15,0.9)', padding: '3rem 2rem 2rem', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', height: '1px', width: '60%', background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
        <div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>
            <span className="gradient-text">Rosa Mystica</span>
          </div>
          <div style={{ color: '#475569', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>Full Stack Developer · Thoothukudi, TN</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {[
            { href: 'https://github.com/rosamystica14', icon: <FiGithub />, label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/rosa-mystica-061281347/', icon: <FiLinkedin />, label: 'LinkedIn' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ width: 40, height: 40, borderRadius: '0.6rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#c4b5fd'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >{s.icon}</a>
          ))}
          <button onClick={scrollTop}
            style={{ width: 40, height: 40, borderRadius: '0.6rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(124,58,237,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          ><FiArrowUp /></button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(124,58,237,0.08)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <span style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>
          © 2026 Rosa Mystica. All rights reserved.
        </span>
        <span style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Built with <FiHeart style={{ color: '#7c3aed', fontSize: '0.8rem' }} /> React · TypeScript · Framer Motion
        </span>
      </div>
    </footer>
  );
}
