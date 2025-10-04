import { Button } from '@renderer/components/ui/button';
import {
  Settings,
  Menu,
  X,
  MoreHorizontal,
  Search,
  Edit,
  Play,
  Pause,
  Square,
  SkipForward,
  Download,
  Moon,
  CheckSquare,
  Trash2,
  ArrowRight,
  FileText,
  ArrowLeft,
  Check,
} from 'lucide-react';

export function ButtonTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Button Component Test
          </h1>
          <p className="text-text-secondary text-lg">
            Interactive demonstration of all button variants, sizes, and states
          </p>
        </div>

        {/* Section 1: Variants & Sizes Matrix */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6 pb-3 border-b-2 border-border-light">
            1. Button Variants & Sizes Matrix
          </h2>
          <p className="text-text-secondary mb-6 text-sm font-medium">
            All button variants (columns) × All sizes (rows)
          </p>

          {/* Column Headers */}
          <div className="grid grid-cols-5 gap-6 mb-4">
            <div className="font-semibold text-text-primary">Primary</div>
            <div className="font-semibold text-text-primary">Secondary</div>
            <div className="font-semibold text-text-primary">Ghost</div>
            <div className="font-semibold text-text-primary">Destructive</div>
            <div className="font-semibold text-text-primary">Icon</div>
          </div>

          {/* Small Size Row */}
          <div className="mb-6">
            <p className="text-text-secondary text-sm font-medium mb-3">
              Small (32px, 12px text)
            </p>
            <div className="grid grid-cols-5 gap-6">
              <Button variant="primary" size="sm">
                Button
              </Button>
              <Button variant="secondary" size="sm">
                Button
              </Button>
              <Button variant="ghost" size="sm">
                Button
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
              <Button variant="icon" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Medium Size Row (Default) */}
          <div className="mb-6">
            <p className="text-text-secondary text-sm font-medium mb-3">
              Medium (40px, 14px text) - Default
            </p>
            <div className="grid grid-cols-5 gap-6">
              <Button variant="primary" size="md">
                Button
              </Button>
              <Button variant="secondary" size="md">
                Button
              </Button>
              <Button variant="ghost" size="md">
                Button
              </Button>
              <Button variant="destructive" size="md">
                Delete
              </Button>
              <Button variant="icon" size="md">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Large Size Row */}
          <div>
            <p className="text-text-secondary text-sm font-medium mb-3">
              Large (48px, 16px text)
            </p>
            <div className="grid grid-cols-5 gap-6">
              <Button variant="primary" size="lg">
                Button
              </Button>
              <Button variant="secondary" size="lg">
                Button
              </Button>
              <Button variant="ghost" size="lg">
                Button
              </Button>
              <Button variant="destructive" size="lg">
                Delete
              </Button>
              <Button variant="icon" size="lg">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 2: Button States */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6 pb-3 border-b-2 border-border-light">
            2. Button States
          </h2>
          <p className="text-text-secondary mb-6 text-sm font-medium">
            Primary button in all interactive states
          </p>

          <div className="flex gap-6 p-6 bg-background-secondary rounded-lg">
            <div className="text-center">
              <Button variant="primary" size="md">
                Default
              </Button>
              <p className="mt-2 text-xs text-text-secondary">Normal state</p>
            </div>
            <div className="text-center">
              <Button variant="primary" size="md" className="hover:bg-primary-700">
                Hover
              </Button>
              <p className="mt-2 text-xs text-text-secondary">
                Hover to see effect
              </p>
            </div>
            <div className="text-center">
              <Button variant="primary" size="md" disabled>
                Disabled
              </Button>
              <p className="mt-2 text-xs text-text-secondary">Opacity 0.6</p>
            </div>
            <div className="text-center">
              <Button variant="primary" size="md" loading>
                Loading
              </Button>
              <p className="mt-2 text-xs text-text-secondary">With spinner</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mt-8 mb-4">
            All Variants - Disabled State
          </h3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="md" disabled>
              Primary
            </Button>
            <Button variant="secondary" size="md" disabled>
              Secondary
            </Button>
            <Button variant="ghost" size="md" disabled>
              Ghost
            </Button>
            <Button variant="destructive" size="md" disabled>
              Destructive
            </Button>
            <Button variant="icon" size="md" disabled>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Section 3: Buttons with Icons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6 pb-3 border-b-2 border-border-light">
            3. Buttons with Icons
          </h2>
          <p className="text-text-secondary mb-6 text-sm font-medium">
            Buttons with leading icons (icon + text)
          </p>

          <div className="flex gap-4 flex-wrap mb-8">
            <Button variant="primary" size="md" leftIcon={<Download className="h-4 w-4" />}>
              Download
            </Button>
            <Button variant="secondary" size="md" leftIcon={<Moon className="h-4 w-4" />}>
              Toggle Theme
            </Button>
            <Button variant="ghost" size="md" leftIcon={<CheckSquare className="h-4 w-4" />}>
              Complete Task
            </Button>
            <Button variant="destructive" size="md" leftIcon={<Trash2 className="h-4 w-4" />}>
              Delete File
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mt-8 mb-4">
            Large Buttons with Icons
          </h3>
          <div className="flex gap-4 flex-wrap mb-8">
            <Button variant="primary" size="lg" leftIcon={<ArrowRight className="h-5 w-5" />}>
              Start Conversion
            </Button>
            <Button variant="secondary" size="lg" leftIcon={<FileText className="h-5 w-5" />}>
              Add Files
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mt-8 mb-4">
            Small Buttons with Icons
          </h3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="sm" leftIcon={<ArrowRight className="h-3 w-3" />}>
              Next
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-3 w-3" />}>
              Back
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Search className="h-3 w-3" />}>
              Search
            </Button>
          </div>
        </section>

        {/* Section 4: Icon Buttons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6 pb-3 border-b-2 border-border-light">
            4. Icon Buttons
          </h2>
          <p className="text-text-secondary mb-6 text-sm font-medium">
            Square buttons with just icons (no text)
          </p>

          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Medium Icon Buttons (40×40px)
          </h3>
          <div className="flex gap-4 flex-wrap mb-8">
            <Button variant="icon" size="md" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="md" title="Menu">
              <Menu className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="md" title="Close">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="md" title="More Options">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="md" title="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="md" title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Small Icon Buttons (32×32px)
          </h3>
          <div className="flex gap-4 flex-wrap mb-8">
            <Button variant="icon" size="sm" title="Play">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="sm" title="Pause">
              <Pause className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="sm" title="Stop">
              <Square className="h-4 w-4" />
            </Button>
            <Button variant="icon" size="sm" title="Skip">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Icon Buttons with Variants
          </h3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="md" className="w-10 px-0" title="Primary Action">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="md" className="w-10 px-0" title="Secondary Action">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="md" className="w-10 px-0" title="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Section 5: Interactive Demo */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6 pb-3 border-b-2 border-border-light">
            5. Interactive Demo
          </h2>
          <p className="text-text-secondary mb-6 text-sm font-medium">
            Click these buttons to see console output
          </p>

          <div className="flex gap-4 flex-wrap">
            <Button
              variant="primary"
              size="md"
              onClick={() => console.log('Primary button clicked')}
            >
              Click Me (Primary)
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => console.log('Secondary button clicked')}
            >
              Click Me (Secondary)
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => console.log('Ghost button clicked')}
            >
              Click Me (Ghost)
            </Button>
            <Button
              variant="destructive"
              size="md"
              onClick={() => console.log('Destructive button clicked')}
            >
              Click Me (Destructive)
            </Button>
            <Button
              variant="primary"
              size="md"
              loading
              onClick={() => console.log('This should not fire')}
            >
              Loading State
            </Button>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-border-light text-center">
          <p className="text-text-tertiary text-sm">
            FFmpeg GUI Design System - Button Component Test Page
          </p>
          <p className="text-text-tertiary text-sm mt-2">
            All buttons are fully interactive - hover, click, and test all states!
          </p>
        </div>
      </div>
    </div>
  );
}
