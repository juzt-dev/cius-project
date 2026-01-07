'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Particles } from '@/components/magicui';
import { cn } from '@/lib/utils';
import { BlurReveal } from '@/components/ui/blur-reveal';

const PARTICLES_CONFIG = {
  mouseForce: 12,
  cursorSize: 120,
  isViscous: true,
  viscous: 40,
  resolution: 0.3,
  dt: 0.018,
  BFECC: false,
  autoDemo: true,
  autoSpeed: 0.35,
  autoIntensity: 1.8,
  colors: ['#F95E1E', '#FF7A3D', '#F95E1E', '#FFA726', '#F95E1E'] as string[],
};

const PARALLAX_OFFSET: ['start start', 'end start'] = ['start start', 'end start'];
const PARALLAX_RANGE: [string, string] = ['0vh', '-20vh'];

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: PARALLAX_OFFSET,
  });

  const y = useTransform(scrollYProgress, [0, 1], PARALLAX_RANGE);

  return (
    <section
      ref={container}
      className="relative h-screen flex items-start justify-center overflow-hidden pt-12 md:pt-8"
    >
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 w-full h-[120vh]"
          style={{
            backgroundImage: 'url(/images/Bg-image.avif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </motion.div>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/10 z-[1]" />

      {/* LiquidEther Animation */}
      <div className="absolute inset-0 opacity-50 z-[2]">
        <Particles {...PARTICLES_CONFIG} />
      </div>

      {/* Content */}
      <div className="relative z-[10] w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-primary" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-gray-300 font-normal"> Introducing Business </span>
            </div>

            {/* H1 with BlurReveal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-5 leading-tight font-[family-name:var(--font-manrope)] relative w-full max-w-5xl">
              <span className="block bg-clip-text text-transparent font-light py-2 sm:py-3 md:py-4 px-2 sm:px-4 relative z-[1] -mb-2 sm:-mb-3 md:-mb-4 bg-gradient-to-b from-white to-gray-400">
                <BlurReveal delay={0.0}>Engineering</BlurReveal>
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal bg-clip-text text-transparent font-[family-name:var(--font-instrument-serif)] italic relative z-[2] bg-gradient-to-l from-primary to-primary/20">
                <BlurReveal delay={0.1}>the&nbsp;</BlurReveal>
                <BlurReveal delay={0.2}>Next&nbsp;</BlurReveal>
                <BlurReveal delay={0.3}>Horizon.</BlurReveal>
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              A technology studio at the intersection of design, AI, and Web3 building products that
              shape tomorrow's digital universe.
            </p>

            {/* CTAs */}
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 px-4">
              <Link
                href="/contact"
                className={cn(
                  'inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-4 sm:px-5 md:px-6',
                  'rounded-full text-sm font-medium',
                  'bg-primary/80 backdrop-blur-md text-primary-foreground',
                  'hover:bg-primary hover:scale-105 active:scale-95',
                  'transition-all duration-200 border border-white/20',
                  'shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),inset_0_-1px_4px_rgba(0,0,0,0.15)]'
                )}
              >
                Get in touch
              </Link>

              <Link
                href="/products"
                className={cn(
                  'inline-flex items-center justify-center h-10 sm:h-11 px-4 sm:px-5 md:px-6',
                  'rounded-full text-sm font-medium',
                  'border border-white/20 bg-white/10 backdrop-blur-md text-white',
                  'hover:bg-white/20 hover:scale-105 active:scale-95',
                  'transition-all duration-200',
                  'shadow-[inset_0_1px_4px_rgba(255,255,255,0.15),inset_0_-1px_4px_rgba(0,0,0,0.1)]'
                )}
              >
                See products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Fade Out - Blur boundary between sections */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[3434px] h-[194px] pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(180deg, rgba(2, 2, 2, 0) 0%, hsl(0 0% 1.5%) 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
