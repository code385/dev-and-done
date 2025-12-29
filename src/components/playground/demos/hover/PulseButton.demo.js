import { createDemo } from '../core/DemoBase';

/**
 * Pulse Button Demo
 */
export const PulseButtonDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    // Add pulsing box-shadow animation
    targetElement.style.animation = 'pulseButton 2s ease infinite';
    targetElement.setAttribute('data-demo-pulse', instanceId);

    // Add CSS animation if not exists
    if (!document.getElementById('pulse-button-style')) {
      const style = document.createElement('style');
      style.id = 'pulse-button-style';
      style.textContent = `
        @keyframes pulseButton {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 217, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(0, 217, 255, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'pulse-button');

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    targetElement.style.animation = '';
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
    targetElement.removeAttribute('data-demo-pulse');
  }
);

