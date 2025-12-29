/**
 * Demo Registry
 * Central registry for all available demos
 */

// Import demo modules
import { ParallaxBackgroundDemo } from '../backgrounds/ParallaxBackground.demo';
import { GradientPulseDemo } from '../backgrounds/GradientPulse.demo';
import { ParticleDriftDemo } from '../backgrounds/ParticleDrift.demo';
import { AmbientGradientShiftDemo } from '../backgrounds/AmbientGradientShift.demo';
import { LiquidFlowBackgroundDemo } from '../backgrounds/LiquidFlowBackground.demo';
import { StarfieldDriftDemo } from '../backgrounds/StarfieldDrift.demo';
import { AuroraBorealisDemo } from '../backgrounds/AuroraBorealis.demo';
import { MagneticCursorDemo } from '../hover/MagneticCursor.demo';
import { ScaleOnHoverDemo } from '../hover/ScaleOnHover.demo';
import { PulseButtonDemo } from '../hover/PulseButton.demo';
import { GlowOutlineDemo } from '../hover/GlowOutline.demo';
import { Tilt3DDemo } from '../hover/Tilt3D.demo';
import { TypewriterEffectDemo } from '../typography/TypewriterEffect.demo';
import { GlitchTextDemo } from '../typography/GlitchText.demo';

/**
 * Demo Registry
 * Maps demo IDs to their apply/cleanup functions
 */
export const demoRegistry = {
  // Background demos
  'parallax-background': {
    name: 'Parallax Background',
    category: 'backgrounds',
    target: 'data-preview-hero',
    demo: ParallaxBackgroundDemo,
  },
  'gradient-pulse': {
    name: 'Gradient Pulse',
    category: 'backgrounds',
    target: 'data-preview-hero',
    demo: GradientPulseDemo,
  },
  'particle-drift': {
    name: 'Particle Drift',
    category: 'backgrounds',
    target: 'data-preview-hero',
    demo: ParticleDriftDemo,
  },
  'ambient-gradient-shift': {
    name: 'Ambient Gradient Shift',
    category: 'backgrounds',
    target: 'data-preview-hero',
    demo: AmbientGradientShiftDemo,
  },
  'liquid-flow-background': {
    name: 'Liquid Flow Background',
    category: 'backgrounds',
    target: 'data-preview-hero',
    demo: LiquidFlowBackgroundDemo,
  },
  'starfield-drift': {
    name: 'Starfield Drift',
    category: 'backgrounds',
    target: 'data-preview-hero',
    demo: StarfieldDriftDemo,
  },
  'aurora-borealis-effect': {
    name: 'Aurora Borealis',
    category: 'backgrounds',
    target: 'data-preview-hero',
    demo: AuroraBorealisDemo,
  },
  
  // Hover demos
  'magnetic-cursor': {
    name: 'Magnetic Cursor',
    category: 'hover',
    target: 'data-preview-button',
    demo: MagneticCursorDemo,
  },
  'scale-on-hover': {
    name: 'Scale On Hover',
    category: 'hover',
    target: 'data-preview-button',
    demo: ScaleOnHoverDemo,
  },
  'pulse-button': {
    name: 'Pulse Button',
    category: 'hover',
    target: 'data-preview-button',
    demo: PulseButtonDemo,
  },
  'glow-outline': {
    name: 'Glow Outline',
    category: 'hover',
    target: 'data-preview-button',
    demo: GlowOutlineDemo,
  },
  'tilt-3d': {
    name: 'Tilt 3D',
    category: 'hover',
    target: 'data-preview-button',
    demo: Tilt3DDemo,
  },
  
  // Typography demos
  'typewriter-effect': {
    name: 'Typewriter Effect',
    category: 'typography',
    target: 'data-preview-text',
    demo: TypewriterEffectDemo,
  },
  'glitch-text': {
    name: 'Glitch Text',
    category: 'typography',
    target: 'data-preview-text',
    demo: GlitchTextDemo,
  },
};

/**
 * Get demo by ID
 */
export function getDemo(id) {
  return demoRegistry[id];
}

/**
 * Get demos by category
 */
export function getDemosByCategory(category) {
  return Object.entries(demoRegistry)
    .filter(([_, demo]) => demo.category === category)
    .map(([id, demo]) => ({ id, ...demo }));
}

/**
 * Get all demo IDs
 */
export function getAllDemoIds() {
  return Object.keys(demoRegistry);
}

/**
 * Get target selector for demo
 */
export function getTargetSelector(demoId) {
  const demo = demoRegistry[demoId];
  return demo ? `[${demo.target}]` : null;
}

