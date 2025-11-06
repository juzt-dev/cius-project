import { Card } from '@/components/ui';
import { Code, Cpu, Globe } from '@geist-ui/react-icons';
import { cn } from '@/lib/utils';

const focusAreas = [
  {
    icon: Code,
    title: 'Design Excellence',
    description:
      'Creating interfaces that blend aesthetics with functionality. Every pixel matters, every interaction delights.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: Cpu,
    title: 'AI Innovation',
    description:
      'Harnessing artificial intelligence as a creative co-pilot. Building tools that augment human potential.',
    gradient: 'from-primary/20 to-orange-500/20',
    iconColor: 'text-primary',
  },
  {
    icon: Globe,
    title: 'Web3 Future',
    description:
      'Exploring decentralized technologies and blockchain. Shaping the next generation of internet experiences.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
];

export function OurFocus() {
  return (
    <section className="py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Header */}
          <div className="col-span-12 text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Our Focus</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">What Drives Us</h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Three pillars that define our approach to building the future
            </p>
          </div>

          {/* Focus Cards */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {focusAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card
                  key={area.title}
                  className={cn(
                    'group relative p-8 transition-all duration-500 hover:scale-105',
                    'border-2 hover:border-primary/50',
                    'bg-gradient-to-br',
                    area.gradient
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                      'bg-background/80 backdrop-blur-sm',
                      'group-hover:scale-110 transition-transform duration-300'
                    )}
                  >
                    <Icon className={cn('w-7 h-7', area.iconColor)} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{area.title}</h3>

                  <p className="text-muted-foreground leading-relaxed">{area.description}</p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
