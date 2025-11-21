import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    if (config.plugins) {
      config.plugins.push(tailwindcss());
    } else {
      config.plugins = [tailwindcss()];
    }
    return config;
  },
  docs: {
    autodocs: true, // 모든 스토리에 자동으로 docs 생성
  },
};

export default config;
