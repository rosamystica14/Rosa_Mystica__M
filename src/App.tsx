import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Journey from './components/sections/Journey';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Certifications from './components/sections/Certifications';
import Contact from './components/sections/Contact';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, scaleX, transformOrigin: '0%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', zIndex: 9999 }} />
  );
}

function CustomCursor() {
  useEffect(() => {
    const dot = document.querySelector<HTMLDivElement>('.cursor-dot');
    const ring = document.querySelector<HTMLDivElement>('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => ring.classList.add('hovering');
    const onLeave = () => ring.classList.remove('hovering');

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}

export default function App() {
  return (
    <>
      {/* Custom cursor */}
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <CustomCursor />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Page transition wrapper */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Journey />
          <Projects />
          <Skills />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </motion.div>

      {/* Global spin animation for loader */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px #22c55e; }
          50% { box-shadow: 0 0 16px #22c55e, 0 0 24px #22c55e; }
        }
        @media (max-width: 768px) {
          .hidden { display: none !important; }
        }
        .md\\:flex { display: flex; }
        @media (max-width: 767px) {
          .md\\:flex { display: none !important; }
          .hidden.md\\:flex { display: none !important; }
        }
      `}</style>
    </>
  );
}
