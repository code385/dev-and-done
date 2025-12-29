import { createDemo } from '../core/DemoBase';

/**
 * Glitch Text Effect Demo
 */
export const GlitchTextDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const originalText = targetElement.textContent || targetElement.innerText || '';
    if (!originalText) return;

    targetElement.style.position = 'relative';
    targetElement.setAttribute('data-demo-glitch', instanceId);

    // Create glitch layers
    const glitch1 = document.createElement('span');
    glitch1.textContent = originalText;
    glitch1.className = 'absolute inset-0';
    glitch1.style.clipPath = 'inset(0 0 0 0)';
    glitch1.style.color = 'rgba(0, 217, 255, 0.8)';
    glitch1.style.transform = 'translate(2px, -2px)';
    glitch1.style.animation = 'glitch1 0.3s infinite';
    glitch1.style.pointerEvents = 'none';

    const glitch2 = document.createElement('span');
    glitch2.textContent = originalText;
    glitch2.className = 'absolute inset-0';
    glitch2.style.clipPath = 'inset(0 0 0 0)';
    glitch2.style.color = 'rgba(147, 51, 234, 0.8)';
    glitch2.style.transform = 'translate(-2px, 2px)';
    glitch2.style.animation = 'glitch2 0.3s infinite';
    glitch2.style.pointerEvents = 'none';

    targetElement.appendChild(glitch1);
    targetElement.appendChild(glitch2);

    // Add CSS animations
    if (!document.getElementById('glitch-text-style')) {
      const style = document.createElement('style');
      style.id = 'glitch-text-style';
      style.textContent = `
        @keyframes glitch1 {
          0%, 100% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(20% 0 60% 0); }
          40% { clip-path: inset(60% 0 20% 0); }
          60% { clip-path: inset(40% 0 40% 0); }
          80% { clip-path: inset(80% 0 10% 0); }
        }
        @keyframes glitch2 {
          0%, 100% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(60% 0 20% 0); }
          40% { clip-path: inset(20% 0 60% 0); }
          60% { clip-path: inset(40% 0 40% 0); }
          80% { clip-path: inset(10% 0 80% 0); }
        }
      `;
      document.head.appendChild(style);
    }

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'glitch-text');

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    const glitch1 = targetElement.querySelector('span[data-demo-glitch]');
    const glitch2 = targetElement.querySelectorAll('span');
    glitch2.forEach(span => {
      if (span !== targetElement.firstChild && span.style.position === 'absolute') {
        span.remove();
      }
    });

    targetElement.style.position = '';
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
    targetElement.removeAttribute('data-demo-glitch');
  }
);

