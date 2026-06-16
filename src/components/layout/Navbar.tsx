import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '1rem 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.4s ease',
          background: scrolled ? 'rgba(5,5,15,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none',
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}>RM</div>
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#f8fafc' }}>
            Rosa Mystica
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem' }}>
          {links.map(link => (
            <a key={link.href} href={link.href}
              onClick={() => setActive(link.href)}
              style={{
                color: active === link.href ? '#c4b5fd' : '#94a3b8',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                transition: 'color 0.3s ease', position: 'relative', padding: '0.25rem 0',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = active === link.href ? '#c4b5fd' : '#94a3b8')}
            >{link.label}</a>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="https://github.com/rosamystica14" target="_blank" rel="noopener noreferrer"
            style={{ color: '#94a3b8', transition: 'color 0.3s ease', fontSize: '1.1rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
          ><FiGithub /></a>
          <a href="https://www.linkedin.com/in/rosa-mystica-061281347/" target="_blank" rel="noopener noreferrer"
            style={{ color: '#94a3b8', transition: 'color 0.3s ease', fontSize: '1.1rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#06b6d4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
          ><FiLinkedin /></a>
          <a href="/Rosa_Mystica__M.pdf" download
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '9999px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: '#fff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600,
              boxShadow: '0 0 20px rgba(124,58,237,0.35)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 35px rgba(124,58,237,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(124,58,237,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
          >Resume</a>
          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)}
            style={{ color: '#94a3b8', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}
          >{menuOpen ? <FiX /> : <FiMenu />}</button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 70, left: 0, right: 0, zIndex: 999,
              background: 'rgba(5,5,15,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(124,58,237,0.2)',
              padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
            }}>
            {links.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 500 }}
              >{link.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
