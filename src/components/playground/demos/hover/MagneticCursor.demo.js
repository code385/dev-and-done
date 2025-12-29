import { createDemo } from '../core/DemoBase';

/**
 * Magnetic Cursor Demo
 * Makes buttons/elements follow cursor
 */
export const MagneticCursorDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    // Store original transform
    const originalTransform = targetElement.style.transform || '';

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const rect = targetElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX = e.clientX - centerX;
      mouseY = e.clientY - centerY;
    };

    const animate = () => {
      currentX += (mouseX * 0.1 - currentX) * 0.1;
      currentY += (mouseY * 0.1 - currentY) * 0.1;
      
      targetElement.style.transform = `${originalTransform} translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animate);
    };

    targetElement.addEventListener('mousemove', handleMouseMove);
    targetElement.addEventListener('mouseenter', () => {
      animate();
    });
    targetElement.addEventListener('mouseleave', () => {
      currentX = 0;
      currentY = 0;
      mouseX = 0;
      mouseY = 0;
      targetElement.style.transform = originalTransform;
    });

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'magnetic');
    targetElement._magneticHandlers = targetElement._magneticHandlers || [];
    targetElement._magneticHandlers.push({ instanceId, handleMouseMove });

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    if (targetElement._magneticHandlers) {
      const handlerData = targetElement._magneticHandlers.find(h => h.instanceId === instanceId);
      if (handlerData) {
        targetElement.removeEventListener('mousemove', handlerData.handleMouseMove);
        targetElement._magneticHandlers = targetElement._magneticHandlers.filter(
          h => h.instanceId !== instanceId
        );
      }
    }

    targetElement.style.transform = '';
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

