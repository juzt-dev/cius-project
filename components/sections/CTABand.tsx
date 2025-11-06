'use client';

import Link from 'next/link';
import { ShimmerButton, ShinyText } from '@/components/animations';
import { ArrowRight } from '@geist-ui/react-icons';
import { useState } from 'react';

export function CTABand() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3">
            <div className="text-center space-y-8">
              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-foreground">Ready to Build</span>
                  <span className="block bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
                    the Future?
                  </span>
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join us on a journey to explore uncharted territories in technology, design, and
                  innovation.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/contact">
                  <ShimmerButton
                    shimmerColor="#ffffff"
                    shimmerSize="0.15em"
                    borderRadius="100px"
                    shimmerDuration="2s"
                    background="hsl(var(--primary))"
                    className="px-10 py-5 text-lg font-medium flex items-center gap-3"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <ShinyText text="Start Your Journey" speed={3} disabled={!isHovered} />
                    <ArrowRight className="w-6 h-6 !text-black" strokeWidth={2.5} />
                  </ShimmerButton>
                </Link>

                <Link
                  href="/about"
                  className="px-10 py-5 rounded-full text-lg font-medium border-2 border-border hover:border-primary bg-background/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Learn More About Us
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
