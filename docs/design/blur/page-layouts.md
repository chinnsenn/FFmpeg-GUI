# Page Layouts - Glassmorphism Design

This document provides detailed page-specific layout specifications for each page in the FFmpeg GUI application using the glassmorphism design system.

## Layout Architecture

### Global Layout Structure

All pages share a common layout structure:

```
┌─────────────────────────────────────────────────┐
│  Header (Glass Bar - Fixed Top)                 │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ Sidebar  │  Main Content Area                   │
│ (Glass)  │  (Page-specific layout)              │
│          │                                       │
│          │                                       │
│          │                                       │
├──────────┴──────────────────────────────────────┤
│  Footer (Glass Status Bar - Fixed Bottom)       │
└─────────────────────────────────────────────────┘
```

### Layout Dimensions

```css
:root {
  --sidebar-width: 240px;
  --header-height: 64px;
  --footer-height: 48px;
  --content-padding: 32px;
  --max-content-width: 1400px;
}
```

---

## 1. Home Page Layout

**Purpose**: Welcome screen with feature overview and quick actions

### Layout Specification

```
┌─────────────────────────────────────────────────┐
│  Hero Section (Glass Panel)                     │
│  - Large heading                                │
│  - Subtitle                                     │
│  - Quick action buttons                         │
└─────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│  Convert     │  Compress    │  Queue       │
│  Card        │  Card        │  Card        │
│  (Glass)     │  (Glass)     │  (Glass)     │
└──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────┐
│  Recent Activity (Glass Panel)                  │
│  - Last 3 tasks                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Statistics (Glass Cards Grid)                  │
│  - Total tasks | Success rate | Files processed│
└─────────────────────────────────────────────────┘
```

### Implementation

```tsx
// src/renderer/src/pages/Home.tsx
export function HomePage() {
  return (
    <div className="min-h-full p-8 space-y-8">
      {/* Hero Section */}
      <section className="backdrop-blur-glass-strong bg-gradient-to-br from-white/15 to-white/8 border border-white/12 rounded-glass-2xl p-12 shadow-glass-lg">
        <div className="max-w-3xl">
          <h1 className="text-primary text-5xl font-bold tracking-tight mb-4">
            Professional Video Processing
          </h1>
          <p className="text-secondary text-xl mb-8">
            Convert, compress, and manage your video files with FFmpeg's power and a beautiful interface.
          </p>
          <div className="flex gap-4">
            <GlassButton variant="primary" size="lg">
              Start Converting
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              View Queue
            </GlassButton>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-3 gap-6">
        <FeatureCard
          icon="🔄"
          title="Format Conversion"
          description="Convert videos to 50+ formats with custom settings"
          to="/convert"
        />
        <FeatureCard
          icon="📦"
          title="Compression"
          description="Reduce file size with CRF or target size compression"
          to="/compress"
        />
        <FeatureCard
          icon="📋"
          title="Task Queue"
          description="Manage multiple tasks with real-time progress tracking"
          to="/queue"
        />
      </section>

      {/* Recent Activity */}
      <section className="backdrop-blur-glass-medium bg-gradient-to-br from-white/12 to-white/6 border border-white/12 rounded-glass-xl p-6 shadow-glass-md">
        <h2 className="text-primary text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentTasks.map((task) => (
            <RecentTaskItem key={task.id} task={task} />
          ))}
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="grid grid-cols-3 gap-6">
        <StatCard label="Total Tasks" value="127" icon="📊" />
        <StatCard label="Success Rate" value="98.4%" icon="✅" />
        <StatCard label="Files Processed" value="2.3 TB" icon="💾" />
      </section>
    </div>
  );
}
```

### Feature Card Component

```tsx
function FeatureCard({ icon, title, description, to }) {
  return (
    <Link to={to}>
      <div className="backdrop-blur-glass-medium bg-gradient-to-br from-white/15 to-white/8 border border-white/12 rounded-glass-xl p-6 shadow-glass-md transition-all duration-200 hover:from-white/18 hover:to-white/10 hover:border-white/18 hover:-translate-y-1 hover:shadow-glass-lg">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-primary text-lg font-semibold mb-2">{title}</h3>
        <p className="text-secondary text-sm">{description}</p>
      </div>
    </Link>
  );
}
```

---

## 2. Convert Page Layout

**Purpose**: Video format conversion with file selection and configuration

### Layout Specification

```
┌─────────────────────────────────────────────────┐
│  Page Header                                    │
│  - Title: "Format Conversion"                   │
│  - Subtitle                                     │
└─────────────────────────────────────────────────┘

┌────────────────────────┬─────────────────────────┐
│  File Selection Panel  │  Configuration Panel   │
│  (Glass Card)          │  (Glass Card)          │
│                        │                        │
│  - Dropzone            │  - Format selector     │
│  - File list           │  - Codec settings      │
│  - Media info          │  - Quality controls    │
│                        │  - Output path         │
│                        │                        │
│                        │  [Start Conversion]    │
└────────────────────────┴─────────────────────────┘
```

### Implementation

```tsx
// src/renderer/src/pages/Convert.tsx
export function ConvertPage() {
  return (
    <div className="min-h-full p-8 space-y-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-primary text-3xl font-bold tracking-tight mb-2">
          Format Conversion
        </h1>
        <p className="text-secondary text-base">
          Convert videos to different formats with custom codec and quality settings
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel - File Selection */}
        <GlassCard variant="secondary" hoverable={false} className="space-y-4">
          <h2 className="text-primary text-lg font-semibold">Select Files</h2>

          {/* Dropzone */}
          <FileDropzone
            onFilesSelected={handleFilesSelected}
            accept="video/*"
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-secondary text-sm font-medium">
                Selected Files ({files.length})
              </h3>
              <FileList files={files} onRemove={handleRemoveFile} />
            </div>
          )}

          {/* Media Info */}
          {selectedFile && (
            <MediaInfoPanel file={selectedFile} />
          )}
        </GlassCard>

        {/* Right Panel - Configuration */}
        <GlassCard variant="secondary" hoverable={false} className="space-y-4">
          <h2 className="text-primary text-lg font-semibold">Conversion Settings</h2>

          <ConversionConfig
            config={config}
            onChange={setConfig}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <GlassButton
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleStartConversion}
              disabled={files.length === 0}
            >
              Start Conversion
            </GlassButton>
            <GlassButton variant="secondary" onClick={handleReset}>
              Reset
            </GlassButton>
          </div>
        </GlassCard>
      </div>

      {/* Presets Section */}
      <GlassCard variant="tertiary" className="mt-6">
        <h3 className="text-primary text-base font-semibold mb-4">
          Quick Presets
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {presets.map((preset) => (
            <PresetButton
              key={preset.id}
              preset={preset}
              onClick={() => handleApplyPreset(preset)}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
```

---

## 3. Compress Page Layout

**Purpose**: Video compression with quality control

### Layout Specification

```
┌─────────────────────────────────────────────────┐
│  Page Header                                    │
│  - Title: "Video Compression"                   │
└─────────────────────────────────────────────────┘

┌────────────────────────┬─────────────────────────┐
│  File Selection        │  Compression Settings  │
│  (Glass Card)          │  (Glass Card)          │
│                        │                        │
│  - Dropzone            │  - Mode selector       │
│  - File preview        │    • CRF               │
│  - Original size info  │    • Target size       │
│                        │    • Preset            │
│                        │                        │
│                        │  - Quality slider      │
│                        │  - Codec settings      │
│                        │  - Preview estimate    │
│                        │                        │
│                        │  [Start Compression]   │
└────────────────────────┴─────────────────────────┘
```

### Implementation

```tsx
// src/renderer/src/pages/Compress.tsx
export function CompressPage() {
  return (
    <div className="min-h-full p-8 space-y-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-primary text-3xl font-bold tracking-tight mb-2">
          Video Compression
        </h1>
        <p className="text-secondary text-base">
          Reduce file size while maintaining quality with advanced compression algorithms
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel - File Selection */}
        <GlassCard variant="secondary" hoverable={false} className="space-y-4">
          <h2 className="text-primary text-lg font-semibold">Select Video</h2>

          <FileDropzone
            onFilesSelected={handleFileSelected}
            accept="video/*"
            multiple={false}
          />

          {file && (
            <>
              <FilePreview file={file} />

              {/* Original File Info */}
              <div className="backdrop-blur-glass-light bg-white/5 border border-white/8 rounded-glass-md p-4">
                <h3 className="text-secondary text-xs uppercase tracking-wide mb-3">
                  Original File
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Size" value={formatBytes(file.size)} />
                  <InfoItem label="Duration" value={formatDuration(file.duration)} />
                  <InfoItem label="Bitrate" value={formatBitrate(file.bitrate)} />
                  <InfoItem label="Resolution" value={`${file.width}x${file.height}`} />
                </div>
              </div>
            </>
          )}
        </GlassCard>

        {/* Right Panel - Compression Settings */}
        <GlassCard variant="secondary" hoverable={false} className="space-y-6">
          <h2 className="text-primary text-lg font-semibold">Compression Settings</h2>

          {/* Compression Mode Selector */}
          <div className="space-y-3">
            <label className="text-secondary text-sm font-medium">Compression Mode</label>
            <div className="grid grid-cols-3 gap-3">
              <ModeButton
                active={mode === 'crf'}
                onClick={() => setMode('crf')}
                label="CRF Quality"
                description="Quality-based"
              />
              <ModeButton
                active={mode === 'target'}
                onClick={() => setMode('target')}
                label="Target Size"
                description="Size-based"
              />
              <ModeButton
                active={mode === 'preset'}
                onClick={() => setMode('preset')}
                label="Preset"
                description="Quick options"
              />
            </div>
          </div>

          {/* Mode-specific Settings */}
          <CompressionModeSettings mode={mode} config={config} onChange={setConfig} />

          {/* Estimated Output */}
          {estimate && (
            <div className="backdrop-blur-glass-light bg-gradient-to-br from-blue-500/15 to-blue-500/8 border border-blue-500/30 rounded-glass-md p-4">
              <h3 className="text-blue-400 text-xs uppercase tracking-wide mb-3">
                Estimated Output
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Size" value={formatBytes(estimate.size)} />
                <InfoItem label="Reduction" value={`${estimate.reduction}%`} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <GlassButton
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleStartCompression}
              disabled={!file}
            >
              Start Compression
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
```

---

## 4. Queue Page Layout

**Purpose**: Task management with real-time progress tracking

### Layout Specification

```
┌─────────────────────────────────────────────────┐
│  Queue Header                                   │
│  - Active tasks count                           │
│  - Actions: Pause All | Resume All | Clear     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Filters & Tabs                                 │
│  [ All | Running | Pending | Completed | Failed]│
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Task Card (Running - Glass Blue)               │
│  - File name | Progress bar | Actions          │
│  - Stats: Speed | ETA | FPS | Bitrate          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Task Card (Pending - Glass Gray)               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Task Card (Completed - Glass Green)            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Empty State (No tasks)                         │
└─────────────────────────────────────────────────┘
```

### Implementation

```tsx
// src/renderer/src/pages/Queue.tsx
export function QueuePage() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const tasks = useTaskQueue(filter);

  return (
    <div className="min-h-full p-8 space-y-6">
      {/* Queue Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-3xl font-bold tracking-tight mb-2">
            Task Queue
          </h1>
          <p className="text-secondary text-base">
            {tasks.length} tasks • {tasks.filter(t => t.status === 'running').length} running
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex gap-3">
          <GlassButton variant="secondary" onClick={handlePauseAll}>
            Pause All
          </GlassButton>
          <GlassButton variant="secondary" onClick={handleResumeAll}>
            Resume All
          </GlassButton>
          <GlassButton variant="danger" onClick={handleClearCompleted}>
            Clear Completed
          </GlassButton>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="backdrop-blur-glass-medium bg-white/8 border border-white/12 rounded-glass-lg p-1 flex gap-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'flex-1 px-4 py-2 rounded-glass-md text-sm font-medium transition-all duration-200',
              filter === f.value
                ? 'bg-white/15 text-primary border border-white/18'
                : 'text-secondary hover:bg-white/8 hover:text-primary'
            )}
          >
            {f.label}
            {f.count > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs">
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
```

### Task Card Component

```tsx
function TaskCard({ task }: { task: Task }) {
  const stateVariant = {
    running: 'running',
    completed: 'completed',
    failed: 'failed',
    paused: 'paused',
    pending: 'default',
  }[task.status] as const;

  return (
    <GlassCard state={stateVariant} hoverable={false} className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-primary text-base font-semibold font-mono truncate">
            {task.fileName}
          </h3>
          <p className="text-tertiary text-xs mt-1">
            {task.operation} • Started {formatTimeAgo(task.startedAt)}
          </p>
        </div>
        <TaskActions task={task} />
      </div>

      {/* Progress Bar (if running) */}
      {task.status === 'running' && (
        <GlassProgressBar value={task.progress} showLabel />
      )}

      {/* Statistics Grid */}
      {task.status === 'running' && (
        <div className="grid grid-cols-4 gap-4">
          <StatItem label="Speed" value={`${task.speed}x`} />
          <StatItem label="ETA" value={formatDuration(task.eta)} />
          <StatItem label="FPS" value={task.fps.toString()} />
          <StatItem label="Bitrate" value={formatBitrate(task.bitrate)} />
        </div>
      )}

      {/* Completed Info */}
      {task.status === 'completed' && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-400">✓ Completed</span>
          <span className="text-tertiary">
            Duration: {formatDuration(task.duration)}
          </span>
          <span className="text-tertiary">
            Output: {formatBytes(task.outputSize)}
          </span>
        </div>
      )}

      {/* Error Info */}
      {task.status === 'failed' && (
        <div className="backdrop-blur-glass-light bg-red-500/10 border border-red-500/20 rounded-glass-md p-3">
          <p className="text-red-400 text-sm font-mono">{task.error}</p>
        </div>
      )}
    </GlassCard>
  );
}
```

---

## 5. Settings Page Layout

**Purpose**: Application configuration and preferences

### Layout Specification

```
┌─────────────────────────────────────────────────┐
│  Page Header                                    │
│  - Title: "Settings"                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FFmpeg Configuration (Glass Card)              │
│  - Path input                                   │
│  - Auto-detect button                           │
│  - Version display                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Performance Settings (Glass Card)              │
│  - Concurrent tasks slider                      │
│  - Hardware acceleration toggle                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Output Settings (Glass Card)                   │
│  - Default output folder                        │
│  - File naming pattern                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Appearance Settings (Glass Card)               │
│  - Theme selector (if multiple themes)          │
│  - Blur intensity slider                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  About (Glass Card)                             │
│  - Version info                                 │
│  - Links                                        │
└─────────────────────────────────────────────────┘
```

### Implementation

```tsx
// src/renderer/src/pages/Settings.tsx
export function SettingsPage() {
  return (
    <div className="min-h-full p-8 space-y-6 max-w-4xl">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-primary text-3xl font-bold tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-secondary text-base">
          Configure FFmpeg and application preferences
        </p>
      </header>

      {/* FFmpeg Configuration */}
      <GlassCard variant="secondary" hoverable={false} className="space-y-4">
        <h2 className="text-primary text-lg font-semibold">FFmpeg Configuration</h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-secondary text-sm font-medium mb-2 block">
              FFmpeg Path
            </span>
            <div className="flex gap-3">
              <input
                type="text"
                value={ffmpegPath}
                onChange={(e) => setFfmpegPath(e.target.value)}
                placeholder="/usr/local/bin/ffmpeg"
                className="flex-1 px-4 py-3 rounded-glass-lg bg-white/6 backdrop-blur-glass-light border border-white/12 text-primary text-sm placeholder:text-tertiary focus:outline-none focus:bg-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20"
              />
              <GlassButton variant="secondary" onClick={handleAutoDetect}>
                Auto-detect
              </GlassButton>
            </div>
          </label>

          {ffmpegVersion && (
            <div className="backdrop-blur-glass-light bg-green-500/10 border border-green-500/20 rounded-glass-md p-3">
              <p className="text-green-400 text-sm">
                ✓ FFmpeg {ffmpegVersion} detected
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Performance Settings */}
      <GlassCard variant="secondary" hoverable={false} className="space-y-4">
        <h2 className="text-primary text-lg font-semibold">Performance</h2>

        <div className="space-y-4">
          <label className="block">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary text-sm font-medium">
                Concurrent Tasks
              </span>
              <span className="text-primary text-sm font-mono">{concurrentTasks}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={concurrentTasks}
              onChange={(e) => setConcurrentTasks(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-secondary text-sm font-medium block">
                Hardware Acceleration
              </span>
              <span className="text-tertiary text-xs">
                Use GPU for encoding when available
              </span>
            </div>
            <ToggleSwitch
              checked={hardwareAccel}
              onChange={setHardwareAccel}
            />
          </label>
        </div>
      </GlassCard>

      {/* Output Settings */}
      <GlassCard variant="secondary" hoverable={false} className="space-y-4">
        <h2 className="text-primary text-lg font-semibold">Output Settings</h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-secondary text-sm font-medium mb-2 block">
              Default Output Folder
            </span>
            <div className="flex gap-3">
              <input
                type="text"
                value={outputFolder}
                readOnly
                className="flex-1 px-4 py-3 rounded-glass-lg bg-white/6 backdrop-blur-glass-light border border-white/12 text-primary text-sm"
              />
              <GlassButton variant="secondary" onClick={handleBrowseFolder}>
                Browse
              </GlassButton>
            </div>
          </label>
        </div>
      </GlassCard>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <GlassButton variant="secondary" onClick={handleReset}>
          Reset to Defaults
        </GlassButton>
        <GlassButton variant="primary" onClick={handleSave}>
          Save Settings
        </GlassButton>
      </div>
    </div>
  );
}
```

---

## Responsive Considerations

While FFmpeg GUI is a desktop application, consider window resizing:

### Breakpoints

```typescript
// Minimum window sizes
const MIN_WIDTH = 1024; // Minimum comfortable width
const MIN_HEIGHT = 768; // Minimum comfortable height

// Responsive adjustments
const BREAKPOINTS = {
  compact: 1024, // Compact layout (sidebar collapses)
  comfortable: 1280, // Default comfortable layout
  spacious: 1600, // Spacious layout with more padding
};
```

### Compact Mode (< 1280px)

```tsx
// Collapse sidebar or make it overlay
<aside className={cn(
  "fixed inset-y-0 left-0 z-30",
  "w-60 backdrop-blur-glass-strong bg-gradient-to-b from-white/12 to-white/8",
  isCompact ? "transform -translate-x-full" : "transform translate-x-0",
  "transition-transform duration-300"
)}>
```

---

## Common Layout Patterns

### Section Header Pattern

```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-primary text-lg font-semibold">{title}</h2>
  <button className="text-secondary text-sm hover:text-primary">
    {action}
  </button>
</div>
```

### Info Grid Pattern

```tsx
<div className="grid grid-cols-2 gap-4">
  <InfoItem label="Label" value="Value" />
  <InfoItem label="Label" value="Value" />
</div>
```

### Action Bar Pattern

```tsx
<div className="flex items-center justify-between pt-4 border-t border-white/8">
  <span className="text-tertiary text-sm">{info}</span>
  <div className="flex gap-3">
    <GlassButton variant="secondary">Cancel</GlassButton>
    <GlassButton variant="primary">Confirm</GlassButton>
  </div>
</div>
```

---

This page layout specification provides comprehensive guidance for implementing each page in the FFmpeg GUI application with consistent glassmorphism design patterns.
