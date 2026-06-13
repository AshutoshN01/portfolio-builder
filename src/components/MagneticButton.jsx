import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { prefersReducedMotion } from '@utils/helpers';

/**
 * MagneticButton Component — Attracts elements to the cursor position on hover.
 * Applied to call-to-actions, buttons, and visual anchors.
 *
 * Physics config from Project Constitution §6: stiffness: 150, damping: 15.
 */
export function MagneticButton({ children, range = 60, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const isReduced = prefersReducedMotion();
  const [, setIsHovered] = useState(false);

  // Coordinates values to track offset position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations using standard design physics specs
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (isReduced || !ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate center coordinates of the target container
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Pull coordinates inside magnetic zone
    if (Math.abs(distanceX) < range && Math.abs(distanceY) < range) {
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Skip animations on touch devices to avoid tap delay
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  if (isReduced || isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default MagneticButton;
