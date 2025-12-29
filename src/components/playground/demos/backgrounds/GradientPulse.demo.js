import { createDemo } from '../core/DemoBase';

/**
 * Gradient Pulse Demo
 * Applies animated gradient pulse effect
 */
export const GradientPulseDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const gradient = document.createElement('div');
    gradient.className = 'absolute inset-0';
    gradient.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.3), rgba(147, 51, 234, 0.3))';
    gradient.style.backgroundSize = '200% 200%';
    gradient.style.animation = 'gradientPulse 4s ease infinite';
    gradient.setAttribute('data-demo-gradient', instanceId);

    // Add CSS animation if not exists
    if (!document.getElementById('gradient-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'gradient-pulse-style';
      style.textContent = `
        @keyframes gradientPulse {
          0%, 100% { background-position: 0% 50%; opacity: 0.3; }
          50% { background-position: 100% 50%; opacity: 0.6; }
        }
      `;
      document.head.appendChild(style);
    }

    targetElement.appendChild(gradient);
    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'gradient-pulse');

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    const gradient = targetElement.querySelector(`[data-demo-gradient="${instanceId}"]`);
    if (gradient) {
      gradient.remove();
    }
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

