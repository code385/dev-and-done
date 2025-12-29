'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { allDemos, getDemoById } from '@/data/demoCatalog';
import StaticLandingPage from './landingTemplates/StaticLandingPage';

// Import demo components directly
import ParallaxBackground from './demos/backgrounds/ParallaxBackground';
import AmbientGradientShift from './demos/backgrounds/AmbientGradientShift';
import ParticleDrift from './demos/backgrounds/ParticleDrift';
import LiquidFlowBackground from './demos/backgrounds/LiquidFlowBackground';
import GradientPulse from './demos/backgrounds/GradientPulse';
import StarfieldDrift from './demos/backgrounds/StarfieldDrift';
import AuroraBorealis from './demos/backgrounds/AuroraBorealis';
import FireflySwarm from './demos/backgrounds/FireflySwarm';
import MagneticCursor from './demos/hover/MagneticCursor';
import ScaleOnHover from './demos/hover/ScaleOnHover';
import GlowOutline from './demos/hover/GlowOutline';
import PulseButton from './demos/hover/PulseButton';
import Tilt3D from './demos/hover/Tilt3D';
import TypewriterEffect from './demos/typography/TypewriterEffect';

// Demo component map
const demoComponents = {
  'parallax-background': ParallaxBackground,
  'ambient-gradient-shift': AmbientGradientShift,
  'particle-drift': ParticleDrift,
  'liquid-flow-background': LiquidFlowBackground,
  'gradient-pulse': GradientPulse,
  'starfield-drift': StarfieldDrift,
  'aurora-borealis-effect': AuroraBorealis,
  'firefly-swarm': FireflySwarm,
  'magnetic-cursor': MagneticCursor,
  'scale-on-hover': ScaleOnHover,
  'glow-outline': GlowOutline,
  'pulse-button': PulseButton,
  'tilt-3d': Tilt3D,
  'typewriter-effect': TypewriterEffect,
};

// Categorize demos by type
const categorizeDemos = (demoIds) => {
  const backgrounds = [];
  const hoverEffects = [];
  const typography = [];
  const others = [];

  demoIds.forEach(demoId => {
    const demo = getDemoById(demoId);
    if (!demo) return;

    if (demoId.includes('background') || demoId.includes('parallax') || 
        demoId.includes('gradient') || demoId.includes('particle') ||
        demoId.includes('starfield') || demoId.includes('aurora') ||
        demoId.includes('firefly') || demoId.includes('liquid') ||
        demoId.includes('flow') || demoId.includes('drift')) {
      backgrounds.push(demoId);
    } else if (demoId.includes('hover') || demoId.includes('cursor') ||
               demoId.includes('scale') || demoId.includes('glow') ||
               demoId.includes('pulse') || demoId.includes('tilt') ||
               demoId.includes('magnetic')) {
      hoverEffects.push(demoId);
    } else if (demoId.includes('typography') || demoId.includes('text') ||
               demoId.includes('typewriter') || demoId.includes('glitch') ||
               demoId.includes('letter') || demoId.includes('word')) {
      typography.push(demoId);
    } else {
      others.push(demoId);
    }
  });

  return { backgrounds, hoverEffects, typography, others };
};

// Fallback component for unimplemented demos
function FallbackDemo({ demoName }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
      <div className="text-center">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-2xl font-bold mb-2">{demoName}</h3>
        <p className="text-muted-foreground">Demo coming soon</p>
      </div>
    </div>
  );
}

// Render background demos (stacked)
function BackgroundDemos({ demoIds }) {
  if (demoIds.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {demoIds.map(demoId => {
        const Component = demoComponents[demoId];
        const demo = getDemoById(demoId);
        if (!Component) {
          return (
            <div key={demoId} className="absolute inset-0">
              <FallbackDemo demoName={demo?.name || demoId} />
            </div>
          );
        }
        return (
          <div key={demoId} className="absolute inset-0">
            <Component />
          </div>
        );
      })}
    </div>
  );
}

// Render hover effect demos (for buttons)
function HoverDemos({ demoIds }) {
  if (demoIds.length === 0) return null;

  // For now, render the first hover demo
  const firstDemoId = demoIds[0];
  const Component = demoComponents[firstDemoId];
  const demo = getDemoById(firstDemoId);

  if (!Component) {
    return <FallbackDemo demoName={demo?.name || firstDemoId} />;
  }

  return <Component />;
}

// Render typography demos (for headings)
function TypographyDemos({ demoIds }) {
  if (demoIds.length === 0) return null;

  // For now, render the first typography demo
  const firstDemoId = demoIds[0];
  const Component = demoComponents[firstDemoId];
  const demo = getDemoById(firstDemoId);

  if (!Component) {
    return <FallbackDemo demoName={demo?.name || firstDemoId} />;
  }

  return <Component />;
}

export default function LandingPagePreview({ selectedAnimations = [], isGenerating = false }) {
  const categorized = useMemo(() => categorizeDemos(selectedAnimations), [selectedAnimations]);

  const renderTemplate = () => {
    if (isGenerating) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Generating Preview...</h3>
            <p className="text-muted-foreground">Applying selected demos to landing page</p>
          </div>
        </div>
      );
    }

    if (selectedAnimations.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold mb-2">No Preview Generated</h3>
            <p className="text-muted-foreground mb-4">Select demos and click "Create Live Preview" to apply them</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>1. Select demos</span>
              <span>→</span>
              <span>2. Click button</span>
              <span>→</span>
              <span>3. See preview</span>
            </div>
          </div>
        </div>
      );
    }

    // Render demos by category
    const backgroundDemos = categorized.backgrounds.length > 0 ? (
      <BackgroundDemos demoIds={categorized.backgrounds} />
    ) : null;

    const hoverDemos = categorized.hoverEffects.length > 0 ? (
      <HoverDemos demoIds={categorized.hoverEffects} />
    ) : null;

    const typographyDemos = categorized.typography.length > 0 ? (
      <TypographyDemos demoIds={categorized.typography} />
    ) : null;

    // Render static landing page with applied demos
    return (
      <StaticLandingPage
        backgroundDemos={backgroundDemos}
        hoverDemos={hoverDemos}
        typographyDemos={typographyDemos}
      />
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xl font-semibold">Live Preview</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedAnimations.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {selectedAnimations.length} demo{selectedAnimations.length !== 1 ? 's' : ''} applied
            </span>
          )}
        </div>
      </div>
      <div className="border-2 border-border rounded-lg overflow-hidden bg-background shadow-inner">
        <div className="h-[600px] overflow-y-auto scrollbar-thin">
          <Suspense fallback={
            <div className="min-h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          }>
            {renderTemplate()}
          </Suspense>
        </div>
      </div>
    </Card>
  );
}
