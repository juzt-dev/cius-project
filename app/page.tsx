import type { Metadata } from 'next';
import { Hero, WhoWeAre, OurFocus, OurProducts, AISection, CTABand } from '@/components/sections';

export const metadata: Metadata = {
  title: 'CIUSLABS - Exploring the Next Frontier',
  description:
    'A technology studio at the intersection of design, AI, and Web3 - building products that shape tomorrow digital universe.',
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhoWeAre />
      <OurFocus />
      <OurProducts />
      <AISection />
      <CTABand />
    </main>
  );
}
