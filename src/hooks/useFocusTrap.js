import { useEffect } from 'react';

/**
 * useFocusTrap Hook — Traps keyboard Tab focus inside a container element.
 * Standard accessibility control for modals, overlays, and drawers.
 *
 * @param {React.RefObject} ref - The container ref inside which focus should be trapped.
 * @param {boolean} active - Flag to enable or disable the focus trap.
 */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const element = ref.current;

    // Find all standard focusable elements
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = element.querySelectorAll(focusableSelectors);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab -> if currently on first element, wrap to last element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab -> if currently on last element, wrap to first element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Save active element to restore focus on close
    const previousActiveElement = document.activeElement;

    // Focus the first element in the focusable list initially
    firstElement.focus();

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      // Restore focus safely
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [ref, active]);
}

export default useFocusTrap;
