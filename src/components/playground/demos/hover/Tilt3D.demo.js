import { createDemo } from '../core/DemoBase';

/**
 * Tilt 3D Demo
 */
export const Tilt3DDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const originalTransform = targetElement.style.transform || '';
    const originalTransition = targetElement.style.transition || '';

    targetElement.style.transition = 'transform 0.1s ease-out';
    targetElement.style.transformStyle = 'preserve-3d';

    const handleMouseMove = (e) => {
      const rect = targetElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / rect.height) * -10;
      const rotateY = (mouseX / rect.width) * 10;
      
      targetElement.style.transform = `${originalTransform} perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      targetElement.style.transform = originalTransform;
    };

    targetElement.addEventListener('mousemove', handleMouseMove);
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'tilt-3d');
    targetElement._tiltHandlers = targetElement._tiltHandlers || [];
    targetElement._tiltHandlers.push({ instanceId, handleMouseMove, handleMouseLeave });

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    if (targetElement._tiltHandlers) {
      const handlerData = targetElement._tiltHandlers.find(h => h.instanceId === instanceId);
      if (handlerData) {
        targetElement.removeEventListener('mousemove', handlerData.handleMouseMove);
        targetElement.removeEventListener('mouseleave', handlerData.handleMouseLeave);
        targetElement._tiltHandlers = targetElement._tiltHandlers.filter(
          h => h.instanceId !== instanceId
        );
      }
    }

    targetElement.style.transform = '';
    targetElement.style.transition = '';
    targetElement.style.transformStyle = '';
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

