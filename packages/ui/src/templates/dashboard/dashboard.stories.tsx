import type { Meta, StoryObj } from '@storybook/react';
import {
  DashboardTemplate,
  DashboardSidebar,
  DashboardHeader,
  DashboardContent,
  DashboardSection,
} from './dashboard';
import { Home, Users, Settings, BarChart } from 'lucide-react';
import { Button } from '../../atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/card';

const meta = {
  title: 'Templates/Dashboard',
  component: DashboardTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DashboardTemplate
      sidebar={
        <DashboardSidebar
          logo={<span className="font-bold text-lg">Logo</span>}
          navigation={[
            { label: 'Dashboard', icon: <Home className="h-5 w-5" />, isActive: true },
            { label: 'Users', icon: <Users className="h-5 w-5" /> },
            { label: 'Analytics', icon: <BarChart className="h-5 w-5" /> },
            { label: 'Settings', icon: <Settings className="h-5 w-5" /> },
          ]}
          footer={<p className="text-sm text-gray-500">v1.0.0</p>}
        />
      }
      header={
        <DashboardHeader
          title="Dashboard"
          actions={
            <>
              <Button variant="outline">Export</Button>
              <Button>Create New</Button>
            </>
          }
        />
      }
    >
      <DashboardContent>
        <DashboardSection
          title="Overview"
          description="Key metrics and statistics"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-2xl">1,234</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">+20% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Revenue</CardDescription>
                <CardTitle className="text-2xl">$45,231</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Active Sessions</CardDescription>
                <CardTitle className="text-2xl">573</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Conversion Rate</CardDescription>
                <CardTitle className="text-2xl">3.2%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">+2% from last month</p>
              </CardContent>
            </Card>
          </div>
        </DashboardSection>

        <DashboardSection
          title="Recent Activity"
          description="Latest updates and changes"
        >
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">User John Doe registered</p>
                <p className="text-sm">New order #1234 received</p>
                <p className="text-sm">Payment processed successfully</p>
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      </DashboardContent>
    </DashboardTemplate>
  ),
};

export const Simple: Story = {
  render: () => (
    <DashboardTemplate
      sidebar={
        <DashboardSidebar
          logo={<span className="font-bold">App</span>}
          navigation={[
            { label: 'Home', icon: <Home className="h-5 w-5" />, isActive: true },
            { label: 'Settings', icon: <Settings className="h-5 w-5" /> },
          ]}
        />
      }
      header={<DashboardHeader title="Simple Dashboard" />}
    >
      <DashboardContent>
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>This is a simple dashboard layout</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content goes here...</p>
          </CardContent>
        </Card>
      </DashboardContent>
    </DashboardTemplate>
  ),
};
