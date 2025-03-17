import EnrollUser from '../components/EnrollUser.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { TaniAuth } from "../components/controllers/TaniAuth";

const authInstance = new TaniAuth("ykru2gKctIAmpLETxx0buQ", "d2ea1214-22fd-4512-9844-577bdab9ccd5");

const meta: Meta<typeof EnrollUser> = {
  title: 'Components/EnrollUser',
  component: EnrollUser,
  argTypes: {
    authInstance: { control: 'object' }, // Mocking an object instance
    onSuccess: { action: 'handleSuccess' }, // Logs when the function is called
  },
};

export default meta;
type Story = StoryObj<typeof EnrollUser>;

export const Default: Story = {
  args: {
    authInstance,
    onSuccess: (data: any) => console.log('Success callback:', data),
  },
};

