import { createDemo } from '../core/DemoBase';

/**
 * Scale On Hover Demo
 */
export const ScaleOnHoverDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const originalTransition = targetElement.style.transition || '';
    const originalTransform = targetElement.style.transform || '';

    const handleMouseEnter = () => {
      targetElement.style.transition = 'transform 0.3s ease';
      targetElement.style.transform = `${originalTransform} scale(1.1)`;
    };

    const handleMouseLeave = () => {
      targetElement.style.transform = originalTransform;
    };

    targetElement.addEventListener('mouseenter', handleMouseEnter);
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'scale-hover');
    targetElement._scaleHandlers = targetElement._scaleHandlers || [];
    targetElement._scaleHandlers.push({ instanceId, handleMouseEnter, handleMouseLeave });

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    if (targetElement._scaleHandlers) {
      const handlerData = targetElement._scaleHandlers.find(h => h.instanceId === instanceId);
      if (handlerData) {
        targetElement.removeEventListener('mouseenter', handlerData.handleMouseEnter);
        targetElement.removeEventListener('mouseleave', handlerData.handleMouseLeave);
        targetElement._scaleHandlers = targetElement._scaleHandlers.filter(
          h => h.instanceId !== instanceId
        );
      }
    }

    targetElement.style.transform = '';
    targetElement.style.transition = '';
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

