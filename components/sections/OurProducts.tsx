'use client';

import { Card } from '@/components/ui';
import { ArrowRight, Star, Link as LinkIcon, Circle } from '@geist-ui/react-icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

const products = [
  {
    name: 'Nova',
    tagline: 'AI-Powered Design Assistant',
    description:
      'Transform your creative workflow with an intelligent design companion that understands context, suggests improvements, and accelerates production.',
    features: ['Smart Layout Generation', 'Color Palette AI', 'Design System Sync'],
    icon: Star,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    status: 'Live',
  },
  {
    name: 'Orbit',
    tagline: 'Web3 Collaboration Platform',
    description:
      'Decentralized workspace for remote teams. Own your data, control your workflow, and collaborate without boundaries in the Web3 universe.',
    features: ['On-Chain Identity', 'Token-Gated Access', 'DAO Governance'],
    icon: Circle,
    gradient: 'from-primary to-orange-500',
    bgGradient: 'from-primary/10 to-orange-500/10',
    status: 'Beta',
  },
  {
    name: 'Linkr',
    tagline: 'Smart Link Management',
    description:
      'Next-gen link shortener with analytics, QR codes, and smart targeting. Built for marketers, creators, and growth-focused teams.',
    features: ['Advanced Analytics', 'Custom Domains', 'A/B Testing'],
    icon: LinkIcon,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    status: 'Coming Soon',
  },
];

export function OurProducts() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Header */}
          <div className="col-span-12 lg:col-span-10 lg:col-start-2 text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Our Products</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Built for the Future
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our suite of products designed to push boundaries and unlock new possibilities
            </p>
          </div>

          {/* Products Grid */}
          <div className="col-span-12 space-y-8">
            {products.map((product, index) => {
              const Icon = product.icon;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={product.name}
                  className="grid grid-cols-12 gap-6 lg:gap-8"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                    <Card
                      className={cn(
                        'group relative p-8 md:p-10 lg:p-12',
                        'border-2 transition-all duration-500',
                        'bg-gradient-to-br',
                        product.bgGradient,
                        isHovered ? 'border-primary/50 scale-[1.02]' : 'border-border'
                      )}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Side - Icon & Status */}
                        <div className="lg:col-span-3 flex flex-col items-start">
                          <div
                            className={cn(
                              'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
                              'bg-gradient-to-br',
                              product.gradient,
                              'transition-transform duration-300',
                              isHovered && 'scale-110 rotate-3'
                            )}
                          >
                            <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                          </div>

                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium',
                              product.status === 'Live' &&
                                'bg-green-500/20 text-green-600 border border-green-500/30',
                              product.status === 'Beta' &&
                                'bg-primary/20 text-primary border border-primary/30',
                              product.status === 'Coming Soon' &&
                                'bg-purple-500/20 text-purple-600 border border-purple-500/30'
                            )}
                          >
                            {product.status}
                          </span>
                        </div>

                        {/* Middle - Content */}
                        <div className="lg:col-span-6 space-y-4">
                          <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                              {product.name}
                            </h3>
                            <p className="text-lg text-primary font-medium">{product.tagline}</p>
                          </div>

                          <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                          </p>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {product.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-3 py-1 rounded-full text-sm bg-background/80 text-foreground border border-border"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Side - CTA */}
                        <div className="lg:col-span-3 flex items-center lg:justify-end">
                          <Link
                            href={`/products/${product.name.toLowerCase()}`}
                            className={cn(
                              'group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full',
                              'bg-foreground text-background font-medium',
                              'transition-all duration-300',
                              'hover:gap-3 hover:pr-5'
                            )}
                          >
                            Learn More
                            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div
                        className={cn(
                          'absolute inset-0 rounded-lg transition-opacity duration-500 pointer-events-none',
                          'bg-gradient-to-br',
                          product.gradient,
                          isHovered ? 'opacity-5' : 'opacity-0'
                        )}
                      />
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
