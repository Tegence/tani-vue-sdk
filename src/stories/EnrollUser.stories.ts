import EnrollUser from '../components/EnrollUser.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof EnrollUser> = {
  title: 'Components/EnrollUser',
  component: EnrollUser,
};

export default meta;
type Story = StoryObj<typeof EnrollUser>;

export const Default: Story = {};
