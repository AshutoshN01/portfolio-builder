import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/AuthContext';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { PageContainer } from '@components/PageContainer';
import { MagneticButton } from '@components/MagneticButton';

export function Login() {
  const isReduced = prefersReducedMotion();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login(formData.email.trim(), formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Map common Firebase auth codes
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password credential.');
      } else {
        setError('Connection error. Verify your connectivity and retry.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const slideUpVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <PageContainer className="flex items-center justify-center min-h-[85vh] relative py-12">
      <div className="absolute inset-0 bg-accent-glow rounded-full blur-[180px] pointer-events-none z-0 translate-y-[-20%] opacity-40" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          variants={slideUpVariant}
          className="p-8 bg-surface border border-border rounded-xl flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1.5 text-center">
            <h1 className="font-display text-heading-md font-bold text-white tracking-tight uppercase">
              Dashboard Login
            </h1>
            <p className="font-body text-body-sm text-text-muted">
              Access your personalized portfolio workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {error && (
              <div
                className="p-4 bg-error/15 border border-error/30 text-error rounded-md font-body text-body-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-body text-body-sm text-text-secondary font-medium">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-body text-body-sm text-text-secondary font-medium">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <MagneticButton className="w-full">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center justify-center gap-2 hover:shadow-accent disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span>Validating Account...</span>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Enter Workspace</span> <FiArrowRight />
                  </>
                )}
              </button>
            </MagneticButton>
          </form>

          <div className="text-center font-body text-body-sm text-text-muted border-t border-border pt-4 mt-2">
            No account yet?{' '}
            <Link to="/register" className="text-accent hover:text-white transition-colors underline font-medium">
              Create an account
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}

export default Login;
