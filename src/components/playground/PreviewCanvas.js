'use client';

import { useEffect, useRef } from 'react';
import { demoRegistry } from './demos/core/DemoRegistry';

/**
 * Preview Canvas Component
 * Manages demo application and cleanup
 */
export default function PreviewCanvas({ selectedDemoIds = [], children }) {
  const containerRef = useRef(null);
  const activeInstancesRef = useRef(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Cleanup all previous demos
      activeInstancesRef.current.forEach(({ demo, instanceId }) => {
        if (demo && demo.cleanup) {
          demo.cleanup(instanceId);
        }
      });
      activeInstancesRef.current.clear();

      // Apply new demos
      selectedDemoIds.forEach(demoId => {
        const demoConfig = demoRegistry[demoId];
        if (!demoConfig || !demoConfig.demo) {
          console.warn(`Demo ${demoId} not found in registry`);
          return;
        }

        const targetSelector = `[${demoConfig.target}]`;
        const targets = container.querySelectorAll(targetSelector);

        if (targets.length === 0) {
          console.warn(`No targets found for ${demoId} using selector ${targetSelector}`);
          return;
        }

        // Apply demo to all matching targets
        targets.forEach((target, index) => {
          try {
            const instanceId = demoConfig.demo.apply(target);
            activeInstancesRef.current.set(`${demoId}-${index}`, {
              demo: demoConfig.demo,
              instanceId,
              target,
            });
          } catch (error) {
            console.error(`Error applying demo ${demoId}:`, error);
          }
        });
      });
    }, 50);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      activeInstancesRef.current.forEach(({ demo, instanceId }) => {
        if (demo && demo.cleanup) {
          demo.cleanup(instanceId);
        }
      });
      activeInstancesRef.current.clear();
    };
  }, [selectedDemoIds]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
}

