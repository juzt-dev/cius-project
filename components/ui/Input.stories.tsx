import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World',
  },
};

// With Labels
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Email</label>
      <Input type="email" placeholder="email@example.com" />
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Username</label>
        <Input placeholder="Enter username" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Email</label>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Password</label>
        <Input type="password" placeholder="Enter password" />
      </div>
    </div>
  ),
};
