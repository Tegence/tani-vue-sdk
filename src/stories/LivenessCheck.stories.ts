import LivenessCheck from '../components/LivenessCheck.vue';
import type { Meta, StoryObj } from '@storybook/vue3';


const meta: Meta<typeof LivenessCheck> = {
  title: 'Components/LivenessCheck',
  component: LivenessCheck,
  argTypes: {
    onSuccess: { action: 'handleSuccess' }, // Logs when the function is called
  },
};

export default meta;
type Story = StoryObj<typeof LivenessCheck>;

export const Default: Story = {
  args: {
    onSuccess: (data: any) => console.log('Success callback:', data),
  },
};