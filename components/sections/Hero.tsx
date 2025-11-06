'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Particles } from '@/components/magicui';

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '-20vh'], { duration: 0.5 });

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

      {/* LiquidEther Animation on top of background */}
      <div className="absolute inset-0 opacity-50 z-[2]">
        <Particles
          mouseForce={12}
          cursorSize={120}
          isViscous={true}
          viscous={40}
          resolution={0.3}
          dt={0.018}
          BFECC={false}
          autoDemo={true}
          autoSpeed={0.35}
          autoIntensity={1.8}
          colors={['#F95E1E', '#FF7A3D', '#F95E1E', '#FFA726', '#F95E1E']}
        />
      </div>

      {/* Content */}
      <div className="relative z-[10] container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3 text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-medium text-white">From Design · To Development</span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-5 leading-tight font-[family-name:var(--font-poppins)]">
              <span className="block text-white">Exploring the</span>
              <span className="block bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
                Next Frontier
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              A technology studio at the intersection of design, AI, and Web3 building products that
              shape tomorrow's digital universe.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium bg-primary/80 backdrop-blur-md text-primary-foreground hover:bg-primary hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),inset_0_-1px_4px_rgba(0,0,0,0.15)]"
                style={{
                  boxShadow:
                    'inset 0 1px 4px rgba(255,255,255,0.25), inset 0 -1px 4px rgba(0,0,0,0.15)',
                }}
              >
                Get in touch
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center h-10 px-5 rounded-full text-sm font-medium border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 shadow-[inset_0_1px_4px_rgba(255,255,255,0.15),inset_0_-1px_4px_rgba(0,0,0,0.1)]"
                style={{
                  boxShadow:
                    'inset 0 1px 4px rgba(255,255,255,0.15), inset 0 -1px 4px rgba(0,0,0,0.1)',
                }}
              >
                See products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
