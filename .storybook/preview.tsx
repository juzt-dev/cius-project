import type { Preview } from '@storybook/react';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'hsl(0 0% 3.9%)' },
        { name: 'light', value: 'hsl(0 0% 100%)' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark =
        context.globals.backgrounds?.value === 'hsl(0 0% 3.9%)' ||
        context.parameters.backgrounds?.default === 'dark';

      return (
        <div className={isDark ? 'dark' : ''} style={{ padding: '1rem' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
