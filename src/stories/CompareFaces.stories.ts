import CompareFaces from '../components/CompareFaces.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { TaniAuth } from "../components/controllers/TaniAuth";

const authInstance = new TaniAuth("", "");

const meta: Meta<typeof CompareFaces> = {
  title: 'Components/CompareFaces',
  component: CompareFaces,
  argTypes: {
    authInstance: { control: 'object' }, // Mocking an object instance
    onSuccess: { action: 'handleSuccess' }, // Logs when the function is called
    imageUrl: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof CompareFaces>;

export const Default: Story = {
  args: {
    authInstance,
    onSuccess: (data: any) => console.log('Success callback:', data),
    imageUrl: "https://res.cloudinary.com/df7ovxux0/image/upload/v1654623190/cld-sample.jpg",
  },
};