'use client';

import { Star } from '@geist-ui/react-icons';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export function WhoWeAre() {
  return (
    <section
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
      style={{
        backgroundColor: 'hsl(0 0% 1.5%)', // Darker than --background (3.9%) -> 1.5%
      }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm hover:bg-primary/20 transition-colors duration-300">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary"> Introduction </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-manrope)] font-light text-foreground leading-[1.1] text-center">
            <span className="inline-block">C.Labs is a </span>
            <span className="inline-block bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
              leading tech studio{' '}
            </span>
            <span className="inline-block">where </span>
            <span className="inline-block font-medium text-foreground">
              innovation meets execution.{' '}
            </span>
            <span className="inline-block">We create experiences that </span>
            <span className="inline-block bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              push boundaries,{' '}
            </span>
            <span className="inline-block">from </span>
            <span className="inline-block font-medium">AI tools </span>
            <span className="inline-block">to next-gen </span>
            <span className="inline-block font-medium">Web3 platforms. </span>
            <span className="inline-block">Our team combines </span>
            <span className="inline-block text-primary">technical skill </span>
            <span className="inline-block">with </span>
            <span className="inline-block text-primary">design passion, </span>
            <span className="inline-block">ensuring technology is </span>
            <span className="inline-block font-medium">powerful, intuitive, and accessible.</span>
          </h2>
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          className="flex justify-center mt-16 md:mt-20"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
