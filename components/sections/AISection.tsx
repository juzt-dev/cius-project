'use client';

import { Card } from '@/components/ui';
import { Zap, Command, Layers, GitBranch } from '@geist-ui/react-icons';
import { cn } from '@/lib/utils';

const aiFeatures = [
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'From concept to reality in seconds',
  },
  {
    icon: Command,
    title: 'Smart Automation',
    description: 'Focus on creativity, we handle the rest',
  },
  {
    icon: Layers,
    title: 'Context-Aware',
    description: 'Understands your project and adapts',
  },
  {
    icon: GitBranch,
    title: 'Iterative Learning',
    description: 'Gets better with every interaction',
  },
];

export function AISection() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-12 gap-8 lg:gap-16">
          {/* Left Side - Content */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Co-Pilot</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block text-foreground">AI as Your</span>
              <span className="block bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Creative Partner
              </span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              We're building AI that doesn't replace humans — it amplifies them. Our AI co-pilot
              understands context, learns from your workflow, and helps you create faster without
              compromising quality.
            </p>

            <div className="space-y-4">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-xl',
                      'bg-background/50 backdrop-blur-sm border border-border',
                      'hover:border-primary/50 transition-all duration-300',
                      'hover:translate-x-2'
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
            <Card className="relative w-full max-w-md p-8 bg-gradient-to-br from-primary/10 to-blue-500/10 border-2 border-primary/20">
              {/* AI Brain Visual */}
              <div className="relative aspect-square">
                {/* Center Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center animate-pulse">
                    <Zap className="w-12 h-12 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Orbiting Elements */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 animate-spin"
                    style={{
                      animationDuration: `${8 + i * 2}s`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <div
                      className={cn(
                        'absolute w-3 h-3 rounded-full',
                        i % 2 === 0 ? 'bg-primary' : 'bg-blue-500',
                        'shadow-lg'
                      )}
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) translateX(${80 + i * 30}px)`,
                      }}
                    />
                  </div>
                ))}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-blue-500"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary"
                  />
                </svg>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-primary">10x</div>
                  <div className="text-xs text-muted-foreground">Faster Workflow</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
