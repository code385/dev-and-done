/**
 * Demo Base Architecture
 * All demos must export an apply() function and optionally a cleanup() function
 */

/**
 * Demo API Interface
 * @typedef {Object} DemoAPI
 * @property {function(HTMLElement): void} apply - Applies the demo to a target element
 * @property {function(): void} [cleanup] - Cleans up the demo (optional)
 */

/**
 * Base demo class that all demos should extend
 */
export class DemoBase {
  constructor() {
    this.activeInstances = new Map();
  }

  /**
   * Apply demo to target element
   * @param {HTMLElement} targetElement - The DOM element to apply the demo to
   * @returns {string} Instance ID for cleanup
   */
  apply(targetElement) {
    const instanceId = `demo-${Date.now()}-${Math.random()}`;
    this.activeInstances.set(instanceId, targetElement);
    return instanceId;
  }

  /**
   * Cleanup demo instance
   * @param {string} instanceId - Instance ID returned from apply()
   */
  cleanup(instanceId) {
    this.activeInstances.delete(instanceId);
  }

  /**
   * Cleanup all instances
   */
  cleanupAll() {
    this.activeInstances.clear();
  }
}

/**
 * Helper to create a demo module
 * @param {function(HTMLElement): string|void} applyFn - Apply function
 * @param {function(string): void} [cleanupFn] - Cleanup function
 * @returns {DemoAPI}
 */
export function createDemo(applyFn, cleanupFn) {
  const instances = new Map();

  return {
    apply: (targetElement) => {
      const instanceId = `demo-${Date.now()}-${Math.random()}`;
      const result = applyFn(targetElement, instanceId);
      instances.set(instanceId, { element: targetElement, cleanup: result });
      return instanceId;
    },
    cleanup: (instanceId) => {
      const instance = instances.get(instanceId);
      if (instance && cleanupFn) {
        cleanupFn(instanceId, instance.element);
      }
      instances.delete(instanceId);
    },
    cleanupAll: () => {
      instances.forEach((instance, id) => {
        if (cleanupFn) {
          cleanupFn(id, instance.element);
        }
      });
      instances.clear();
    }
  };
}

