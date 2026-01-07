import { Star, Link as LinkIcon, Circle } from '@geist-ui/react-icons';
import type { ComponentType } from 'react';

export interface Product {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  gradient: string;
  bgGradient: string;
  status: 'Live' | 'Beta' | 'Coming Soon';
}

export const PRODUCTS: Product[] = [
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
