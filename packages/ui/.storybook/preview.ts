import type { Preview } from '@storybook/react';
import '../src/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Atoms', 'Molecules', 'Organisms', 'Templates'],
      },
    },
  },
};

export default preview;
