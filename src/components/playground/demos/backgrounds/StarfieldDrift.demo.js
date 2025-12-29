import { createDemo } from '../core/DemoBase';

/**
 * Starfield Drift Demo
 */
export const StarfieldDriftDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const container = document.createElement('div');
    container.className = 'absolute inset-0 overflow-hidden';
    container.setAttribute('data-demo-starfield', instanceId);

    const stars = [];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.8 + 0.2;
      star.className = 'absolute bg-white rounded-full';
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = opacity.toString();
      star.style.pointerEvents = 'none';
      star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity})`;

      container.appendChild(star);
      stars.push(star);
    }

    targetElement.appendChild(container);

    // Animate stars drifting
    let animationFrame;
    const animate = () => {
      stars.forEach((star, i) => {
        const currentTop = parseFloat(star.style.top) || Math.random() * 100;
        const newTop = (currentTop + 0.02 + (i % 3) * 0.01) % 100;
        star.style.top = `${newTop}%`;
        
        // Twinkle effect
        const twinkle = Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.7;
        star.style.opacity = (parseFloat(star.style.opacity) * twinkle).toString();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'starfield');
    targetElement._starfieldAnimations = targetElement._starfieldAnimations || [];
    targetElement._starfieldAnimations.push({ instanceId, frame: animationFrame });

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    const container = targetElement.querySelector(`[data-demo-starfield="${instanceId}"]`);
    if (container) {
      if (targetElement._starfieldAnimations) {
        const anim = targetElement._starfieldAnimations.find(a => a.instanceId === instanceId);
        if (anim) {
          cancelAnimationFrame(anim.frame);
          targetElement._starfieldAnimations = targetElement._starfieldAnimations.filter(
            a => a.instanceId !== instanceId
          );
        }
      }
      container.remove();
    }
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

