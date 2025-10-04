import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@renderer/components/ui/card';
import { StatCard } from '@renderer/components/ui/stat-card';
import { Button } from '@renderer/components/ui/button';
import { Activity, Clock, CheckCircle2, XCircle, TrendingUp, Users, FileVideo, HardDrive } from 'lucide-react';

export default function CardTest() {
  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-h1 mb-2">Card Components Demo</h1>
        <p className="text-text-secondary mb-8">
          Interactive demo of Card variants including shadows, borders, padding, and hover effects.
        </p>

        {/* Section 1: Shadow Variants */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">1. Shadow Variants</h2>
          <div className="grid grid-cols-4 gap-6">
            <Card shadow="none" padding="compact">
              <CardTitle className="mb-2">No Shadow</CardTitle>
              <p className="text-sm text-text-secondary">shadow="none"</p>
            </Card>

            <Card shadow="sm" padding="compact">
              <CardTitle className="mb-2">Small Shadow</CardTitle>
              <p className="text-sm text-text-secondary">shadow="sm" (default)</p>
            </Card>

            <Card shadow="md" padding="compact">
              <CardTitle className="mb-2">Medium Shadow</CardTitle>
              <p className="text-sm text-text-secondary">shadow="md" (hover to see lg)</p>
            </Card>

            <Card shadow="lg" padding="compact">
              <CardTitle className="mb-2">Large Shadow</CardTitle>
              <p className="text-sm text-text-secondary">shadow="lg" (hover to see xl)</p>
            </Card>
          </div>
        </section>

        {/* Section 2: Border Variants */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">2. Border Variants</h2>
          <div className="grid grid-cols-4 gap-6">
            <Card border="none" padding="compact">
              <CardTitle className="mb-2">No Border</CardTitle>
              <p className="text-sm text-text-secondary">border="none"</p>
            </Card>

            <Card border="light" padding="compact">
              <CardTitle className="mb-2">Light Border</CardTitle>
              <p className="text-sm text-text-secondary">border="light" (default)</p>
            </Card>

            <Card border="medium" padding="compact">
              <CardTitle className="mb-2">Medium Border</CardTitle>
              <p className="text-sm text-text-secondary">border="medium"</p>
            </Card>

            <Card border="highlight" padding="compact">
              <CardTitle className="mb-2">Highlight Border</CardTitle>
              <p className="text-sm text-text-secondary">border="highlight"</p>
            </Card>
          </div>
        </section>

        {/* Section 3: Padding Variants */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">3. Padding Variants</h2>
          <div className="grid grid-cols-4 gap-6">
            <Card padding="none">
              <div className="p-2 bg-primary-50 dark:bg-primary-600/10">
                <CardTitle className="mb-1">No Padding</CardTitle>
                <p className="text-xs text-text-secondary">padding="none"</p>
              </div>
            </Card>

            <Card padding="compact">
              <CardTitle className="mb-2">Compact</CardTitle>
              <p className="text-sm text-text-secondary">padding="compact" (16px)</p>
            </Card>

            <Card padding="default">
              <CardTitle className="mb-2">Default</CardTitle>
              <p className="text-sm text-text-secondary">padding="default" (24px)</p>
            </Card>

            <Card padding="spacious">
              <CardTitle className="mb-2">Spacious</CardTitle>
              <p className="text-sm text-text-secondary">padding="spacious" (32px)</p>
            </Card>
          </div>
        </section>

        {/* Section 4: Hover Effects */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">4. Hover Effects</h2>
          <div className="grid grid-cols-3 gap-6">
            <Card hover="none">
              <CardTitle className="mb-2">No Hover</CardTitle>
              <p className="text-sm text-text-secondary">hover="none" (default)</p>
            </Card>

            <Card hover="subtle">
              <CardTitle className="mb-2">Subtle Lift</CardTitle>
              <p className="text-sm text-text-secondary">hover="subtle" (-2px)</p>
            </Card>

            <Card hover="lift">
              <CardTitle className="mb-2">Lift Effect</CardTitle>
              <p className="text-sm text-text-secondary">hover="lift" (-4px)</p>
            </Card>
          </div>
        </section>

        {/* Section 5: Complete Card Structure */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">5. Complete Card Structure</h2>
          <div className="grid grid-cols-2 gap-6">
            <Card shadow="md" hover="lift">
              <CardHeader>
                <CardTitle>Card with Header</CardTitle>
                <CardDescription>This card demonstrates the full structure</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-3">
                  CardContent can contain any content. This example shows how to structure a card
                  with header, content, and footer sections.
                </p>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  <li>CardHeader - Title and description</li>
                  <li>CardContent - Main content area</li>
                  <li>CardFooter - Action buttons</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Primary Action</Button>
                <Button variant="ghost" size="sm" className="ml-2">Cancel</Button>
              </CardFooter>
            </Card>

            <Card shadow="md" border="highlight">
              <CardHeader>
                <CardTitle>Active Task Card</CardTitle>
                <CardDescription>Using highlight border for emphasis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-primary-600" />
                    <span className="text-text-secondary">Status:</span>
                    <span className="text-primary-600 font-medium">Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-secondary">Duration:</span>
                    <span className="text-text-primary font-medium">2m 34s</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" size="sm">Cancel Task</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Section 6: StatCard Examples */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">6. Stat Cards (Dashboard)</h2>
          <div className="grid grid-cols-4 gap-6">
            <StatCard
              title="Running Tasks"
              value={2}
              change={15}
              icon={<Activity className="w-12 h-12" />}
            />

            <StatCard
              title="Queued Tasks"
              value={5}
              icon={<Clock className="w-12 h-12" />}
            />

            <StatCard
              title="Completed"
              value={148}
              change={8}
              trend="up"
              icon={<CheckCircle2 className="w-12 h-12" />}
            />

            <StatCard
              title="Failed"
              value={3}
              change={-2}
              trend="down"
              icon={<XCircle className="w-12 h-12" />}
            />
          </div>
        </section>

        {/* Section 7: Real-World Examples */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">7. Real-World Examples</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Task Card */}
            <Card border="light">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">video_demo.mp4</h3>
                    <p className="text-xs text-text-secondary mt-0.5">MP4 → WebM</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-success-600">Completed</span>
              </div>
              <div className="space-y-2 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="text-text-primary font-medium">15.8 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-text-primary font-medium">2m 14s</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="text-text-primary font-medium">2 minutes ago</span>
                </div>
              </div>
            </Card>

            {/* Quick Action Card */}
            <Card
              border="medium"
              shadow="sm"
              hover="subtle"
              className="cursor-pointer group"
            >
              <div className="flex flex-col items-center justify-center text-center h-full py-4">
                <FileVideo className="w-12 h-12 text-primary-600 mb-3 transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">Quick Convert</h3>
                <p className="text-sm text-text-secondary">Click to start format conversion</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 8: Variant Combinations */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">8. Variant Combinations</h2>
          <div className="grid grid-cols-3 gap-6">
            <Card shadow="md" border="light" padding="spacious" hover="lift">
              <CardTitle className="mb-2">Premium Card</CardTitle>
              <p className="text-sm text-text-secondary">
                shadow="md" + border="light" + padding="spacious" + hover="lift"
              </p>
            </Card>

            <Card shadow="sm" border="highlight" padding="compact">
              <CardTitle className="mb-2">Alert Card</CardTitle>
              <p className="text-sm text-text-secondary">
                shadow="sm" + border="highlight" + padding="compact"
              </p>
            </Card>

            <Card shadow="lg" border="none" padding="default" hover="subtle">
              <CardTitle className="mb-2">Floating Card</CardTitle>
              <p className="text-sm text-text-secondary">
                shadow="lg" + border="none" + hover="subtle"
              </p>
            </Card>
          </div>
        </section>

        {/* Section 9: Nested Cards */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">9. Nested Cards</h2>
          <Card shadow="md" padding="spacious">
            <CardHeader>
              <CardTitle>Parent Card</CardTitle>
              <CardDescription>Cards can contain other cards for complex layouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card border="light" padding="compact" shadow="none">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success-600" />
                    <div>
                      <p className="text-xs text-text-secondary">Total Videos</p>
                      <p className="text-lg font-bold text-text-primary">248</p>
                    </div>
                  </div>
                </Card>

                <Card border="light" padding="compact" shadow="none">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    <div>
                      <p className="text-xs text-text-secondary">Active Users</p>
                      <p className="text-lg font-bold text-text-primary">12</p>
                    </div>
                  </div>
                </Card>

                <Card border="light" padding="compact" shadow="none">
                  <div className="flex items-center gap-2">
                    <FileVideo className="w-4 h-4 text-warning-600" />
                    <div>
                      <p className="text-xs text-text-secondary">Processing</p>
                      <p className="text-lg font-bold text-text-primary">3</p>
                    </div>
                  </div>
                </Card>

                <Card border="light" padding="compact" shadow="none">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-text-tertiary" />
                    <div>
                      <p className="text-xs text-text-secondary">Storage Used</p>
                      <p className="text-lg font-bold text-text-primary">8.4 GB</p>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Instructions */}
        <section className="rounded-lg border border-primary-500 bg-primary-50 p-6 dark:bg-primary-600/10">
          <h2 className="mb-4 border-b border-primary-500/30 pb-3 text-h2">Interactive Features</h2>
          <ul className="list-none space-y-3 p-0">
            <li>
              <strong>Shadow:</strong> Hover over "md" and "lg" shadow cards to see shadow increase
            </li>
            <li>
              <strong>Hover Lift:</strong> Cards with hover="lift" rise -4px on hover with smooth transition
            </li>
            <li>
              <strong>Hover Subtle:</strong> Cards with hover="subtle" rise -2px for gentler effect
            </li>
            <li>
              <strong>Border Highlight:</strong> Blue border (border-2) emphasizes active/selected states
            </li>
            <li>
              <strong>Padding:</strong> compact (16px), default (24px), spacious (32px) for different content densities
            </li>
            <li>
              <strong>Composition:</strong> Mix and match variants for different use cases
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
