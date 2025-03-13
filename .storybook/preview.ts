import type { Preview } from '@storybook/vue3';

import '../src/style.css'; // Import global styles if needed

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' }, // Auto-detects events like `onClick`
    controls: { expanded: true }, // Expands controls panel by default
  },
};

export default preview;
