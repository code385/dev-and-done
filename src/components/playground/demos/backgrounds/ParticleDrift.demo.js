import { createDemo } from '../core/DemoBase';

/**
 * Particle Drift Demo
 * Creates floating particles
 */
export const ParticleDriftDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const container = document.createElement('div');
    container.className = 'absolute inset-0 overflow-hidden';
    container.setAttribute('data-demo-particles', instanceId);

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 2 + 0.5;
      particle.className = 'absolute bg-primary rounded-full';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = '0.4';
      particle.style.pointerEvents = 'none';

      container.appendChild(particle);
      particles.push(particle);
    }

    targetElement.appendChild(container);

    // Animate particles
    let animationFrame;
    const animate = () => {
      particles.forEach((particle, i) => {
        const currentLeft = parseFloat(particle.style.left) || Math.random() * 100;
        const currentTop = parseFloat(particle.style.top) || Math.random() * 100;
        
        particle.style.left = `${(currentLeft + Math.sin(Date.now() * 0.001 + i) * 0.1) % 100}%`;
        particle.style.top = `${(currentTop + Math.cos(Date.now() * 0.001 + i) * 0.1) % 100}%`;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'particles');
    targetElement._particleAnimations = targetElement._particleAnimations || [];
    targetElement._particleAnimations.push({ instanceId, frame: animationFrame });

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    const container = targetElement.querySelector(`[data-demo-particles="${instanceId}"]`);
    if (container) {
      // Cancel animation
      if (targetElement._particleAnimations) {
        const anim = targetElement._particleAnimations.find(a => a.instanceId === instanceId);
        if (anim) {
          cancelAnimationFrame(anim.frame);
          targetElement._particleAnimations = targetElement._particleAnimations.filter(
            a => a.instanceId !== instanceId
          );
        }
      }
      container.remove();
    }
    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

