import { Code, Cpu, Globe } from '@geist-ui/react-icons';
import type { ComponentType } from 'react';

export interface FocusArea {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
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


