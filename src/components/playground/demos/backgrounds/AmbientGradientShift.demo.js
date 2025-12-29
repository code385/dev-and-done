import { createDemo } from '../core/DemoBase';

/**
 * Ambient Gradient Shift Demo
 */
export const AmbientGradientShiftDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const gradient1 = document.createElement('div');
    gradient1.className = 'absolute inset-0';
    gradient1.style.background = 'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.3) 0%, transparent 50%)';
    gradient1.style.animation = 'ambientGradient1 10s ease infinite';
    gradient1.setAttribute('data-demo-ambient-1', instanceId);

    const gradient2 = document.createElement('div');
    gradient2.className = 'absolute inset-0';
    gradient2.style.background = 'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)';
    gradient2.style.animation = 'ambientGradient2 15s ease infinite';
    gradient2.setAttribute('data-demo-ambient-2', instanceId);

    // Add CSS animations
    if (!document.getElementById('ambient-gradient-style')) {
      const style = document.createElement('style');
      style.id = 'ambient-gradient-style';
      style.textContent = `
        @keyframes ambientGradient1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }
        @keyframes ambientGradient2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }

    targetElement.appendChild(gradient1);
    targetElement.appendChild(gradient2);
    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'ambient-gradient');

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    const grad1 = targetElement.querySelector(`[data-demo-ambient-1="${instanceId}"]`);
    const grad2 = targetElement.querySelector(`[data-demo-ambient-2="${instanceId}"]`);
    if (grad1) grad1.remove();
    if (grad2) grad2.remove();
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

