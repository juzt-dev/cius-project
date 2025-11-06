import { Star, Zap } from '@geist-ui/react-icons';

export function WhoWeAre() {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column - Title */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Who We Are</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-foreground">Technology</span>
                <span className="block bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  Meets Vision
                </span>
              </h2>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed">
                CIUSLABS is a forward-thinking technology studio where innovation meets execution.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We're not just building products — we're crafting experiences that push the
                boundaries of what's possible. From AI-powered tools to next-generation Web3
                platforms, we explore uncharted territories in the digital universe.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Our team combines deep technical expertise with a passion for design excellence. We
                believe that technology should be powerful yet intuitive, complex yet elegant,
                innovative yet accessible.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Projects Launched</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">100K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Innovation Mode</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
