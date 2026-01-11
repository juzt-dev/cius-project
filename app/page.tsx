import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections';
import { SectionSkeleton } from '@/components/common/LazyMotion';

// Lazy-load below-fold sections to reduce initial bundle size
// Each section defers ~30-50KB of code + Framer Motion animations
const WhoWeAre = dynamic(
  () => import('@/components/sections/WhoWeAre').then((mod) => ({ default: mod.WhoWeAre })),
  {
    loading: () => <SectionSkeleton height="500px" />,
    ssr: true, // Still render on server for SEO
  }
);

const OurFocus = dynamic(
  () => import('@/components/sections/OurFocus').then((mod) => ({ default: mod.OurFocus })),
  {
    loading: () => <SectionSkeleton height="600px" />,
    ssr: true,
  }
);

const OurProducts = dynamic(
  () => import('@/components/sections/OurProducts').then((mod) => ({ default: mod.OurProducts })),
  {
    loading: () => <SectionSkeleton height="500px" />,
    ssr: true,
  }
);

const AISection = dynamic(
  () => import('@/components/sections/AISection').then((mod) => ({ default: mod.AISection })),
  {
    loading: () => <SectionSkeleton height="600px" />,
    ssr: true,
  }
);

const CTABand = dynamic(
  () => import('@/components/sections/CTABand').then((mod) => ({ default: mod.CTABand })),
  {
    loading: () => <SectionSkeleton height="400px" />,
    ssr: true,
  }
);

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
