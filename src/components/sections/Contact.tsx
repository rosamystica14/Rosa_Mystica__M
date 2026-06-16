import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

type ToastType = 'success' | 'error' | null;

// ✅ Field component moved OUTSIDE to fix cursor/focus bug
const Field = ({
  label, type = 'text', rows = 0, value, onChange, error,
}: {
  name: string; label: string; type?: string; rows?: number;
  value: string; onChange: (val: string) => void; error?: string;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.05em' }}>{label}</label>
    {rows > 0 ? (
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="form-input"
        placeholder={`Your ${label.toLowerCase()}...`}
        style={{ resize: 'vertical', borderColor: error ? 'rgba(239,68,68,0.5)' : undefined }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="form-input"
        placeholder={`Your ${label.toLowerCase()}...`}
        style={{ borderColor: error ? 'rgba(239,68,68,0.5)' : undefined }}
      />
    )}
    {error && <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{error}</span>}
  </div>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.length < 20) e.message = 'Message too short (min 20 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const showToast = (type: ToastType) => {
    setToast(type);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await emailjs.send(
        'service_xx0fqzh',
        'template_zpifijp',
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        },
        'pesf2ObUKd_RGFvBA'
      );
      setForm({ name: '', email: '', subject: '', message: '' });
      showToast('success');
    } catch {
      showToast('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="section-py parallax-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 0, pointerEvents: 'none' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', bottom: '-20%', left: '50%', transform: 'translateX(-50%)' }} />
      </motion.div>

      {/* Toast */}
      {toast && (
        <div className="toast-enter" style={{
          position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 9999,
          padding: '1rem 1.5rem', borderRadius: '0.875rem',
          background: toast === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          display: 'flex', alignItems: 'center', gap: '0.75rem', backdropFilter: 'blur(20px)',
          boxShadow: toast === 'success' ? '0 8px 32px rgba(16,185,129,0.2)' : '0 8px 32px rgba(239,68,68,0.2)',
        }}>
          {toast === 'success'
            ? <FiCheck style={{ color: '#34d399', fontSize: '1.1rem' }} />
            : <FiAlertCircle style={{ color: '#f87171', fontSize: '1.1rem' }} />}
          <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>
            {toast === 'success' ? "Message sent! I'll get back to you soon." : 'Something went wrong. Please try again.'}
          </span>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#06b6d4', letterSpacing: '0.2em', textTransform: 'uppercase' }}>06 / Contact</span>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginTop: '0.5rem' }}>
            <span className="gradient-text">Let's Build </span>
            <span style={{ color: '#f8fafc' }}>Something.</span>
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '1rem', maxWidth: 480, margin: '1rem auto 0', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Open to developer roles, internships, and exciting projects. Let's talk.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Info */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: 9999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: '1.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                <span style={{ color: '#4ade80', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>Open to opportunities</span>
              </div>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Whether you have a role, a project, or just want to connect — my inbox is always open.
              </p>
            </div>

            {[
              { icon: <FiMail />, label: 'Email', val: 'rosaannie2004@gmail.com', href: 'mailto:rosaannie2004@gmail.com' },
              { icon: <FiMapPin />, label: 'Location', val: 'Thoothukudi, Tamil Nadu', href: null },
              { icon: <FiGithub />, label: 'GitHub', val: 'github.com/rosamystica14', href: 'https://github.com/rosamystica14' },
              { icon: <FiLinkedin />, label: 'LinkedIn', val: 'Rosa Mystica', href: 'https://www.linkedin.com/in/rosa-mystica-061281347/' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '0.75rem', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd', fontSize: '1rem', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#e2e8f0', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#e2e8f0')}
                    >{item.val}</a>
                  ) : (
                    <span style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{item.val}</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }}
            className="glass" style={{ borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <Field name="name" label="Name"
              value={form.name} onChange={val => setForm(f => ({ ...f, name: val }))} error={errors.name} />
            <Field name="email" label="Email" type="email"
              value={form.email} onChange={val => setForm(f => ({ ...f, email: val }))} error={errors.email} />
            <Field name="subject" label="Subject"
              value={form.subject} onChange={val => setForm(f => ({ ...f, subject: val }))} error={errors.subject} />
            <Field name="message" label="Message" rows={5}
              value={form.message} onChange={val => setForm(f => ({ ...f, message: val }))} error={errors.message} />

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '0.875rem', borderRadius: '0.875rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#fff', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Sora, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                boxShadow: loading ? 'none' : '0 0 25px rgba(124,58,237,0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(124,58,237,0.6)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = loading ? 'none' : '0 0 25px rgba(124,58,237,0.4)'; }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Sending...
                </>
              ) : (
                <><FiSend /> Send Message</>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}