import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { SectionContainer } from '@components/SectionContainer';
import { fadeUp, staggerContainer, scaleIn } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiMail, FiMapPin, FiSend, FiCheckCircle, FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiYoutube, FiLink, FiPhone } from 'react-icons/fi';
import { MagneticButton } from '@components/MagneticButton';

const iconMap = {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiInstagram,
  FiYoutube,
  FiLink,
  FiPhone,
};

export function ContactSection() {
  const isReduced = prefersReducedMotion();
  const { personalInfo, siteConfig } = usePortfolioData();
  const { contact } = personalInfo;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Bot deterrent field
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error' | 'timeout'
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email address';
    }
    
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    
    if (!formData.message.trim()) {
      tempErrors.message = 'Message content is required';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    // Silent honeypot check
    if (formData.honeypot.trim()) {
      setStatus('success');
      return;
    }

    // Client-side rate-limiting: max 3 per hour
    const rateLimitKey = 'portfolio_form_submissions';
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    let submissions = [];
    try {
      submissions = JSON.parse(localStorage.getItem(rateLimitKey) || '[]');
    } catch {
      submissions = [];
    }
    
    submissions = submissions.filter((timestamp) => now - timestamp < oneHour);
    if (submissions.length >= 3) {
      setErrors({ form: 'Hourly inquiry limit reached. Please retry in 60 minutes.' });
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrors({});

    const formspreeEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
    const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const useFormspree = formspreeEndpoint && formspreeEndpoint !== 'https://formspree.io/f/your_form_id';
    const useEmailJS = emailjsServiceId && emailjsTemplateId && emailjsPublicKey;

    if (!useFormspree && !useEmailJS) {
      console.warn('Formspree and EmailJS endpoints unconfigured. Redirecting to mailto fallback.');
      setTimeout(() => {
        window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          honeypot: '',
        });
      }, 800);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setStatus('timeout');
    }, 10000); // 10s request timeout limit

    let fetchUrl = '';
    let fetchBody = {};
    let fetchHeaders = {};

    if (useFormspree) {
      fetchUrl = formspreeEndpoint;
      fetchBody = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };
      fetchHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
    } else {
      // EmailJS REST API
      fetchUrl = 'https://api.emailjs.com/api/v1.0/email/send';
      fetchBody = {
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        template_params: {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      };
      fetchHeaders = {
        'Content-Type': 'application/json',
      };
    }

    fetch(fetchUrl, {
      method: 'POST',
      body: JSON.stringify(fetchBody),
      headers: fetchHeaders,
      signal: controller.signal,
    })
      .then(async (response) => {
        clearTimeout(timeoutId);
        if (response.ok) {
          // Record local rate-limit timestamp
          submissions.push(now);
          localStorage.setItem(rateLimitKey, JSON.stringify(submissions));

          setStatus('success');
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            honeypot: '',
          });
        } else {
          let errorMsg = 'An error occurred while transmitting the inquiry.';
          try {
            const data = await response.json();
            if (data && data.error) {
              errorMsg = data.error;
            } else if (data && data.errors && data.errors.length > 0) {
              errorMsg = data.errors.map((err) => err.message).join(', ');
            }
          } catch {
            // Keep default message
          }
          setErrors({ form: errorMsg });
          setStatus('error');
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          // Trigger handled via AbortController timeout setup
          return;
        }
        setErrors({ form: 'Network connection failure. Please verify your connectivity and retry.' });
        setStatus('error');
      });
  };

  const handleReset = () => {
    setStatus('idle');
    setErrors({});
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    return null;
  };

  const slideUpVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <SectionContainer
      id="contact"
      overline="05. Contact"
      title="Initiate Project Screening"
      description={contact.description}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column — Communication Channels (4 cols) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="lg:col-span-4 flex flex-col gap-8"
        >
          <motion.div variants={slideUpVariant} className="flex flex-col gap-6">
            <h3 className="font-display text-heading-sm text-white uppercase tracking-wider">
              Outreach Details
            </h3>
            
            {/* Direct Channel Cards */}
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 p-4 bg-surface border border-border hover:border-border-hover rounded-lg transition-colors focus-ring"
                aria-label={`Send email to ${personalInfo.email}`}
              >
                <div className="p-3 bg-elevated border border-border text-accent rounded-md">
                  <FiMail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-overline text-text-muted uppercase tracking-wider">Email</span>
                  <span className="font-mono text-body-sm text-white">{personalInfo.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg">
                <div className="p-3 bg-elevated border border-border text-accent rounded-md">
                  <FiMapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-overline text-text-muted uppercase tracking-wider">Location</span>
                  <span className="font-body text-body-sm text-white">{personalInfo.location}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Profiles Mapping */}
          {siteConfig?.socials && siteConfig.socials.length > 0 && (
            <motion.div variants={slideUpVariant} className="flex flex-col gap-4">
              <h4 className="font-display text-body-sm text-text-secondary uppercase tracking-widest">
                Digital Networks
              </h4>
              <div className="flex flex-wrap gap-3">
                {siteConfig.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-surface border border-border hover:border-border-hover text-text-muted hover:text-white rounded-md transition-all duration-fast focus-ring"
                    aria-label={social.label}
                  >
                    {renderIcon(social.icon)}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column — Contact Form (8 cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={isReduced ? {} : scaleIn}
                className="p-8 bg-surface border border-border rounded-lg text-center flex flex-col items-center gap-6"
                role="region"
                aria-label="Submission success feedback"
              >
                <FiCheckCircle className="text-success w-16 h-16 animate-pulse" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-heading-lg font-bold text-white tracking-tight">
                    Transmission Acknowledged
                  </h3>
                  <p className="font-body text-body-md text-text-secondary max-w-md mx-auto">
                    {contact.successMessage}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded-md text-body-sm font-semibold transition-colors focus-ring"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                noValidate
                className="p-6 md:p-8 bg-surface border border-border rounded-lg flex flex-col gap-6"
                aria-label="Direct inquiry submission form"
              >
                {/* Bot Honeypot Deterrent */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="honeypot">Leave this field blank</label>
                  <input
                    type="text"
                    id="honeypot"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleInputChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                {/* Form-level Error Alert */}
                {errors.form && (
                  <div className="p-4 bg-error/15 border border-error/30 text-error rounded-md font-body text-body-sm flex flex-col gap-1" role="alert">
                    <span className="font-semibold block">Submission Error:</span>
                    <p className="text-text-secondary">{errors.form}</p>
                    {status === 'error' && (
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="text-[11px] font-bold uppercase tracking-wider text-accent hover:text-white mt-1.5 w-fit transition-colors text-left"
                      >
                        Retry Submission
                      </button>
                    )}
                  </div>
                )}

                {/* Request Timeout Alert */}
                {status === 'timeout' && (
                  <div className="p-4 bg-warning/15 border border-warning/30 text-warning rounded-md font-body text-body-sm flex flex-col gap-1" role="alert">
                    <span className="font-semibold block">Request Timeout:</span>
                    <p className="text-text-secondary">The server did not respond within 10 seconds. Please check your connectivity and retry.</p>
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="text-[11px] font-bold uppercase tracking-wider text-accent hover:text-white mt-1.5 w-fit transition-colors text-left"
                    >
                      Retry Submission
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-body text-body-sm text-text-secondary font-medium">
                      Full Name <span className="text-error" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`px-4 py-3 bg-background border rounded-md font-body text-body-sm text-white focus-ring transition-colors ${
                        errors.name ? 'border-error' : 'border-border hover:border-border-hover'
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      disabled={status === 'submitting'}
                    />
                    {errors.name && (
                      <span id="name-error" className="font-body text-overline text-error mt-1" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-body text-body-sm text-text-secondary font-medium">
                      Email Address <span className="text-error" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`px-4 py-3 bg-background border rounded-md font-body text-body-sm text-white focus-ring transition-colors ${
                        errors.email ? 'border-error' : 'border-border hover:border-border-hover'
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      disabled={status === 'submitting'}
                    />
                    {errors.email && (
                      <span id="email-error" className="font-body text-overline text-error mt-1" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="font-body text-body-sm text-text-secondary font-medium">
                    Subject <span className="text-error" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`px-4 py-3 bg-background border rounded-md font-body text-body-sm text-white focus-ring transition-colors ${
                      errors.subject ? 'border-error' : 'border-border hover:border-border-hover'
                    }`}
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    disabled={status === 'submitting'}
                  />
                  {errors.subject && (
                    <span id="subject-error" className="font-body text-overline text-error mt-1" role="alert">
                      {errors.subject}
                    </span>
                  )}
                </div>

                {/* Message field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-body text-body-sm text-text-secondary font-medium">
                    Message <span className="text-error" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`px-4 py-3 bg-background border rounded-md font-body text-body-sm text-white focus-ring transition-colors resize-none ${
                      errors.message ? 'border-error' : 'border-border hover:border-border-hover'
                    }`}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    disabled={status === 'submitting'}
                  />
                  {errors.message && (
                    <span id="message-error" className="font-body text-overline text-error mt-1" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <MagneticButton className="w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center justify-center gap-2 hover:shadow-accent disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {status === 'submitting' ? (
                      <>
                        <span>Transmitting Inquiry...</span>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        <span>Transmit Inquiry</span> <FiSend />
                      </>
                    )}
                  </button>
                </MagneticButton>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionContainer>
  );
}
export default ContactSection;
