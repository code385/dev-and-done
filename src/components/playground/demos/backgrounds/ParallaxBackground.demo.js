import { createDemo } from '../core/DemoBase';

/**
 * Parallax Background Demo
 * Applies parallax scrolling effect to background
 */
export const ParallaxBackgroundDemo = createDemo(
  // Apply function
  (targetElement, instanceId) => {
    if (!targetElement) return;

    // Create parallax layers
    const layer1 = document.createElement('div');
    layer1.className = 'absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20';
    layer1.style.transform = 'translateZ(0)';
    layer1.setAttribute('data-parallax-layer', '1');

    const layer2 = document.createElement('div');
    layer2.className = 'absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent';
    layer2.style.transform = 'translateZ(0)';
    layer2.setAttribute('data-parallax-layer', '2');

    // Add particles
    const particles = document.createElement('div');
    particles.className = 'absolute inset-0';
    particles.setAttribute('data-parallax-layer', '3');

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-primary rounded-full opacity-30';
      particle.style.left = `${(i * 5) % 100}%`;
      particle.style.top = `${(i * 7) % 100}%`;
      particles.appendChild(particle);
    }

    targetElement.appendChild(layer1);
    targetElement.appendChild(layer2);
    targetElement.appendChild(particles);

    // Parallax scroll handler
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      
      layer1.style.transform = `translateY(${scrollY * 0.3}px)`;
      layer2.style.transform = `translateY(${scrollY * 0.5}px)`;
      particles.style.transform = `translateY(${scrollY * 0.2}px)`;
      
      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Store cleanup data
    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'parallax');
    targetElement._parallaxHandlers = targetElement._parallaxHandlers || [];
    targetElement._parallaxHandlers.push({ instanceId, handler: handleScroll });

    return instanceId;
  },
  // Cleanup function
  (instanceId, targetElement) => {
    if (!targetElement) return;

    // Remove parallax layers
    const layers = targetElement.querySelectorAll('[data-parallax-layer]');
    layers.forEach(layer => layer.remove());

    // Remove scroll handler
    if (targetElement._parallaxHandlers) {
      const handlerData = targetElement._parallaxHandlers.find(h => h.instanceId === instanceId);
      if (handlerData) {
        window.removeEventListener('scroll', handlerData.handler);
        targetElement._parallaxHandlers = targetElement._parallaxHandlers.filter(
          h => h.instanceId !== instanceId
        );
      }
    }

    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
  }
);

