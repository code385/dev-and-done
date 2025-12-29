import { createDemo } from '../core/DemoBase';

/**
 * Typewriter Effect Demo
 * Applies typewriter animation to text
 */
export const TypewriterEffectDemo = createDemo(
  (targetElement, instanceId) => {
    if (!targetElement) return;

    const originalText = targetElement.textContent || targetElement.innerText || '';
    if (!originalText) return;

    targetElement.textContent = '';
    targetElement.setAttribute('data-demo-typewriter', instanceId);

    let currentIndex = 0;
    const speed = 50; // ms per character

    const type = () => {
      if (currentIndex < originalText.length) {
        targetElement.textContent = originalText.slice(0, currentIndex + 1);
        currentIndex++;
        setTimeout(type, speed);
      } else {
        // Add blinking cursor
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.className = 'text-primary animate-pulse';
        targetElement.appendChild(cursor);
      }
    };

    type();

    targetElement.setAttribute(`data-demo-instance-${instanceId}`, 'typewriter');

    return instanceId;
  },
  (instanceId, targetElement) => {
    if (!targetElement) return;

    // Remove cursor if exists
    const cursor = targetElement.querySelector('span.animate-pulse');
    if (cursor) cursor.remove();

    targetElement.removeAttribute(`data-demo-instance-${instanceId}`);
    targetElement.removeAttribute('data-demo-typewriter');
  }
);

