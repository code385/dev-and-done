import { createDemo } from '../core/DemoBase';

/**
 * Glow Outline Demo
 */
export const GlowOutlineDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const originalBoxShadow = targetElement.style.boxShadow || '';

    const handleMouseEnter = () => {
      targetElement.style.transition = 'box-shadow 0.3s ease';
      targetElement.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.6), 0 0 40px rgba(0, 217, 255, 0.4)';
    };

    const handleMouseLeave = () => {
      targetElement.style.boxShadow = originalBoxShadow;
    };

    targetElement.addEventListener('mouseenter', handleMouseEnter);
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'glow-outline');
    targetElement._glowHandlers = targetElement._glowHandlers || [];
    targetElement._glowHandlers.push({ instanceId, handleMouseEnter, handleMouseLeave });

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    if (targetElement._glowHandlers) {
      const handlerData = targetElement._glowHandlers.find(h => h.instanceId === instanceId);
      if (handlerData) {
        targetElement.removeEventListener('mouseenter', handlerData.handleMouseEnter);
        targetElement.removeEventListener('mouseleave', handlerData.handleMouseLeave);
        targetElement._glowHandlers = targetElement._glowHandlers.filter(
          h => h.instanceId !== instanceId
        );
      }
    }

    targetElement.style.boxShadow = '';
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

