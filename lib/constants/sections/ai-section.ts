import { Zap, Command, Layers, GitBranch } from '@geist-ui/react-icons';
import type { ComponentType } from 'react';

export interface AIFeature {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

export const AI_FEATURES: AIFeature[] = [
  { icon: Zap, title: 'Instant Generation', description: 'From concept to reality in seconds' },
  { icon: Command, title: 'Smart Automation', description: 'Focus on creativity, we handle the rest' },
  { icon: Layers, title: 'Context-Aware', description: 'Understands your project and adapts' },
  { icon: GitBranch, title: 'Iterative Learning', description: 'Gets better with every interaction' },
];


