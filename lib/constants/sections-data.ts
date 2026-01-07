import {
  Code,
  Cpu,
  Globe,
  Star,
  ArrowRight,
  Link as LinkIcon,
  Circle,
  Zap,
  Command,
  Layers,
  GitBranch,
} from '@geist-ui/react-icons';
import type { ComponentType } from 'react';

export interface FocusArea {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

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

export interface AIFeature {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

export const FOCUS_AREAS: FocusArea[] = [
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

export const AI_FEATURES: AIFeature[] = [
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
