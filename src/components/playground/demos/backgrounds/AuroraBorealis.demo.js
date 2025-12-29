import { createDemo } from '../core/DemoBase';

/**
 * Aurora Borealis Effect Demo
 */
export const AuroraBorealisDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const container = document.createElement('div');
    container.className = 'absolute inset-0 overflow-hidden';
    container.setAttribute('data-demo-aurora', instanceId);

    // Create aurora layers
    for (let i = 0; i < 3; i++) {
      const layer = document.createElement('div');
      layer.className = 'absolute inset-0';
      layer.style.background = `linear-gradient(${120 + i * 20}deg, 
        rgba(0, 217, 255, ${0.2 - i * 0.05}), 
        rgba(147, 51, 234, ${0.2 - i * 0.05}), 
        transparent)`;
      layer.style.animation = `auroraWave${i} ${15 + i * 5}s ease-in-out infinite`;
      layer.style.filter = 'blur(40px)';
      layer.setAttribute('data-aurora-layer', i.toString());

      // Add CSS animation
      if (!document.getElementById(`aurora-style-${i}`)) {
        const style = document.createElement('style');
        style.id = `aurora-style-${i}`;
        style.textContent = `
          @keyframes auroraWave${i} {
            0%, 100% { 
              transform: translateY(0) scaleY(1);
              opacity: ${0.3 - i * 0.1};
            }
            50% { 
              transform: translateY(-${20 + i * 10}px) scaleY(1.2);
              opacity: ${0.5 - i * 0.1};
            }
          }
        `;
        document.head.appendChild(style);
      }

      container.appendChild(layer);
    }

    targetElement.appendChild(container);
    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'aurora');

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    const container = targetElement.querySelector(`[data-demo-aurora="${instanceId}"]`);
    if (container) container.remove();
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

