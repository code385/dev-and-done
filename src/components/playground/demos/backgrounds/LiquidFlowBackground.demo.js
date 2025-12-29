import { createDemo } from '../core/DemoBase';

/**
 * Liquid Flow Background Demo
 */
export const LiquidFlowBackgroundDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const container = document.createElement('div');
    container.className = 'absolute inset-0 overflow-hidden';
    container.setAttribute('data-demo-liquid', instanceId);

    const blob1 = document.createElement('div');
    blob1.className = 'absolute rounded-full blur-3xl';
    blob1.style.width = '400px';
    blob1.style.height = '400px';
    blob1.style.background = 'radial-gradient(circle, rgba(0, 217, 255, 0.4), transparent)';
    blob1.style.left = '10%';
    blob1.style.top = '20%';
    blob1.style.animation = 'liquidFlow1 20s ease-in-out infinite';

    const blob2 = document.createElement('div');
    blob2.className = 'absolute rounded-full blur-3xl';
    blob2.style.width = '500px';
    blob2.style.height = '500px';
    blob2.style.background = 'radial-gradient(circle, rgba(147, 51, 234, 0.4), transparent)';
    blob2.style.right = '10%';
    blob2.style.bottom = '20%';
    blob2.style.animation = 'liquidFlow2 25s ease-in-out infinite';

    // Add CSS animations
    if (!document.getElementById('liquid-flow-style')) {
      const style = document.createElement('style');
      style.id = 'liquid-flow-style';
      style.textContent = `
        @keyframes liquidFlow1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 50px) scale(0.9); }
        }
        @keyframes liquidFlow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(0.9); }
          66% { transform: translate(30px, -50px) scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(blob1);
    container.appendChild(blob2);
    targetElement.appendChild(container);
    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'liquid-flow');

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    const container = targetElement.querySelector(`[data-demo-liquid="${instanceId}"]`);
    if (container) container.remove();
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

