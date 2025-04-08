import FaceRecognition from '../components/FaceRecognition.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { TaniAuth } from "../components/controllers/TaniAuth";

const authInstance = new TaniAuth("", "");

const meta: Meta<typeof FaceRecognition> = {
  title: 'Components/FaceRecognition',
  component: FaceRecognition,
  argTypes: {
    authInstance: { control: 'object' }, // Mocking an object instance
    onSuccess: { action: 'handleSuccess' }, // Logs when the function is called
  },
};

export default meta;
type Story = StoryObj<typeof FaceRecognition>;

export const Default: Story = {
  args: {
    authInstance,
    onSuccess: (data: any) => console.log('Success callback:', data),
  },
};