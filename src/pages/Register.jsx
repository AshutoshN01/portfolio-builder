import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/AuthContext';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiUser, FiMail, FiLock, FiArrowRight, FiInfo } from 'react-icons/fi';
import { PageContainer } from '@components/PageContainer';
import { MagneticButton } from '@components/MagneticButton';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export function Register() {
  const isReduced = prefersReducedMotion();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ state: 'idle', message: '' }); // 'idle' | 'checking' | 'available' | 'taken'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleanVal = value;
    if (name === 'username') {
      // Force alphanumeric + hyphen + underscore only
      cleanVal = value.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
      checkUsernameUniqueness(cleanVal);
    }
    setFormData((prev) => ({ ...prev, [name]: cleanVal }));
    if (error) setError('');
  };

  // Debounced check or quick validation query on Firestore
  const checkUsernameUniqueness = async (username) => {
    const val = username.trim();
    if (val.length < 3) {
      setUsernameStatus({ state: 'taken', message: 'Must be at least 3 characters long' });
      return;
    }

    setUsernameStatus({ state: 'checking', message: 'Verifying availability...' });

    try {
      const docRef = doc(db, 'usernames', val);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsernameStatus({ state: 'taken', message: 'Username has already been claimed' });
      } else {
        setUsernameStatus({ state: 'available', message: 'Username is available' });
      }
    } catch {
      setUsernameStatus({ state: 'idle', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, username, email, password, confirmPassword } = formData;

    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please complete all fields.');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (usernameStatus.state === 'taken') {
      setError('Please choose an available username.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await signup(email.trim(), password, username.trim(), name.trim());
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failure:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please provide a valid email address.');
      } else if (err.message.includes('Username has already been claimed')) {
        setError('Username is taken. Choose another slug.');
      } else {
        setError(err.message || 'Registration failed. Verify credentials.');
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
              Builder Registration
            </h1>
            <p className="font-body text-body-sm text-text-muted">
              Create an account and claim your custom URL slug
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {error && (
              <div
                className="p-4 bg-error/15 border border-error/30 text-error rounded-md font-body text-body-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-body text-body-sm text-text-secondary font-medium">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="font-body text-body-sm text-text-secondary font-medium">
                Portfolio Username Slug
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-body-sm text-text-muted">
                  u/
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-md font-mono text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  disabled={submitting}
                  required
                />
              </div>
              {formData.username && (
                <span
                  className={`font-body text-overline flex items-center gap-1 mt-0.5 ${
                    usernameStatus.state === 'available'
                      ? 'text-success'
                      : usernameStatus.state === 'taken'
                        ? 'text-error'
                        : 'text-text-muted'
                  }`}
                >
                  <FiInfo size={12} /> {usernameStatus.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="font-body text-body-sm text-text-secondary font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <MagneticButton className="w-full mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center justify-center gap-2 hover:shadow-accent disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span>Registering Account...</span>
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
                    <span>Claim Your URL</span> <FiArrowRight />
                  </>
                )}
              </button>
            </MagneticButton>
          </form>

          <div className="text-center font-body text-body-sm text-text-muted border-t border-border pt-4 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-white transition-colors underline font-medium">
              Dashboard Login
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}

export default Register;
