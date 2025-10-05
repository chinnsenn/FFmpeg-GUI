import { useState } from 'react';
import { toast } from '@renderer/components/ui/toast';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import {
  Play,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  Upload,
  Download,
} from 'lucide-react';

export default function ToastTest() {
  const [customMessage, setCustomMessage] = useState('Custom toast message');
  const [duration, setDuration] = useState(4000);
  const [loading, setLoading] = useState(false);

  // Simulate async operation
  const simulateUpload = () => {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve('video_sample.mp4');
        } else {
          reject(new Error('Upload failed: Network error'));
        }
      }, 3000);
    });
  };

  const simulateConversion = () => {
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-h1 mb-2">Toast/Notification Demo</h1>
        <p className="text-text-secondary mb-8">
          Interactive demo of Toast notifications with Sonner library, styled with Modern Minimalist
          design system.
        </p>

        {/* Section 1: Basic Toast Types */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">1. Basic Toast Types</h2>
          <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
            <div className="grid grid-cols-4 gap-4">
              <Button
                variant="secondary"
                leftIcon={<Check className="w-4 h-4" />}
                onClick={() => toast.success('Operation successful!')}
              >
                Success
              </Button>

              <Button
                variant="secondary"
                leftIcon={<AlertCircle className="w-4 h-4" />}
                onClick={() => toast.error('Operation failed!')}
              >
                Error
              </Button>

              <Button
                variant="secondary"
                leftIcon={<AlertTriangle className="w-4 h-4" />}
                onClick={() => toast.warning('Warning: Check your settings')}
              >
                Warning
              </Button>

              <Button
                variant="secondary"
                leftIcon={<Info className="w-4 h-4" />}
                onClick={() => toast.info('New update available')}
              >
                Info
              </Button>
            </div>
            <p className="mt-4 text-xs text-text-tertiary">
              Click any button to trigger a toast notification with custom icon and color.
            </p>
          </div>
        </section>

        {/* Section 2: With Description */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">2. Toast with Description</h2>
          <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() =>
                  toast.success('File uploaded successfully', {
                    description: 'video_sample.mp4 (24.8 MB) has been uploaded to the server.',
                  })
                }
              >
                Success with Description
              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  toast.error('Failed to convert video', {
                    description: 'FFmpeg process exited with code 1. Check the log for details.',
                  })
                }
              >
                Error with Description
              </Button>
            </div>
            <p className="mt-4 text-xs text-text-tertiary">
              Toast messages with additional description text for more context.
            </p>
          </div>
        </section>

        {/* Section 3: With Action Button */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">3. Toast with Action Button</h2>
          <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() =>
                  toast.withAction('Task completed successfully', {
                    type: 'success',
                    description: 'Your video has been converted to WebM format.',
                    action: {
                      label: 'View',
                      onClick: () => {
                        toast.info('Opening file location...');
                      },
                    },
                  })
                }
              >
                Success with Action
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  toast.withAction('5 tasks pending in queue', {
                    type: 'info',
                    action: {
                      label: 'View Queue',
                      onClick: () => {
                        toast.info('Navigating to queue page...');
                      },
                    },
                  })
                }
              >
                Info with Action
              </Button>
            </div>
            <p className="mt-4 text-xs text-text-tertiary">
              Toast with clickable action button for user interaction.
            </p>
          </div>
        </section>

        {/* Section 4: Promise Toast */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">4. Promise Toast (Loading → Success/Error)</h2>
          <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <Button
                leftIcon={<Upload className="w-4 h-4" />}
                onClick={() => {
                  toast.promise(simulateUpload(), {
                    loading: 'Uploading file...',
                    success: (filename) => `Successfully uploaded ${filename}`,
                    error: (err) => {
                      if (err instanceof Error) {
                        return err.message;
                      }
                      return 'Upload failed';
                    },
                  });
                }}
              >
                Simulate Upload
              </Button>

              <Button
                leftIcon={<Download className="w-4 h-4" />}
                variant="secondary"
                onClick={() => {
                  const promise = new Promise((resolve) => setTimeout(resolve, 2000));
                  toast.promise(promise, {
                    loading: 'Converting video...',
                    success: 'Conversion completed!',
                    error: 'Conversion failed',
                  });
                }}
              >
                Simulate Conversion
              </Button>
            </div>
            <p className="mt-4 text-xs text-text-tertiary">
              Automatically shows loading state, then success or error based on promise result.
            </p>
          </div>
        </section>

        {/* Section 5: Custom Duration */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">5. Custom Duration</h2>
          <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <Input
                label="Custom Message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your message"
              />
              <Input
                label="Duration (ms)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="4000"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="secondary"
                onClick={() =>
                  toast.info(customMessage, {
                    duration: duration,
                  })
                }
              >
                Show Toast ({duration}ms)
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  toast.warning('Quick message (1 second)', {
                    duration: 1000,
                  })
                }
              >
                1 Second
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  const toastId = toast.info('This will stay forever', {
                    duration: Infinity,
                    description: 'Click the close button to dismiss',
                  });
                  setTimeout(() => {
                    toast.dismiss(toastId);
                  }, 10000);
                }}
              >
                Infinite (auto-close 10s)
              </Button>
            </div>
            <p className="mt-4 text-xs text-text-tertiary">
              Control how long toasts stay visible. Hover over any toast to pause the timer.
            </p>
          </div>
        </section>

        {/* Section 6: Multiple Toasts */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">6. Multiple Toasts & Stacking</h2>
          <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => {
                  toast.success('Task 1 completed');
                  setTimeout(() => toast.success('Task 2 completed'), 300);
                  setTimeout(() => toast.success('Task 3 completed'), 600);
                }}
              >
                3 Success Toasts
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  toast.info('Processing file 1...');
                  toast.info('Processing file 2...');
                  toast.info('Processing file 3...');
                  toast.info('Processing file 4...');
                  toast.info('Processing file 5...');
                }}
              >
                5 Info Toasts
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  toast.success('Success message');
                  toast.error('Error message');
                  toast.warning('Warning message');
                  toast.info('Info message');
                }}
              >
                Mixed Types
              </Button>
            </div>
            <p className="mt-4 text-xs text-text-tertiary">
              Multiple toasts stack vertically with proper spacing and animations.
            </p>
          </div>
        </section>

        {/* Section 7: Real-World Examples */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">7. Real-World Use Cases</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* File Upload Simulation */}
            <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-text-primary">File Upload</h3>
              <Button
                className="w-full"
                leftIcon={<Upload className="w-4 h-4" />}
                onClick={() => {
                  const uploadPromise = new Promise<void>((resolve, reject) => {
                    setTimeout(() => {
                      if (Math.random() > 0.2) {
                        resolve();
                      } else {
                        reject(new Error('Network timeout'));
                      }
                    }, 2500);
                  });

                  toast.promise(uploadPromise, {
                    loading: 'Uploading video_sample.mp4...',
                    success: () => {
                      return 'File uploaded successfully';
                    },
                    error: (err) => {
                      if (err instanceof Error) {
                        return `Upload failed: ${err.message}`;
                      }
                      return 'Upload failed';
                    },
                  });
                }}
              >
                Upload Video File
              </Button>
            </div>

            {/* Task Completion */}
            <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-text-primary">Task Completion</h3>
              <Button
                className="w-full"
                variant="secondary"
                leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                disabled={loading}
                onClick={async () => {
                  await simulateConversion();
                  toast.withAction('Video conversion completed', {
                    type: 'success',
                    description: 'output.webm is ready in your Downloads folder',
                    action: {
                      label: 'Open Folder',
                      onClick: () => {
                        toast.info('Opening file location...');
                      },
                    },
                  });
                }}
              >
                {loading ? 'Converting...' : 'Start Conversion'}
              </Button>
            </div>

            {/* Error Handling */}
            <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-text-primary">Error Handling</h3>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => {
                  toast.error('FFmpeg process failed', {
                    description: 'Exit code 1: Invalid codec parameters',
                    duration: 6000,
                  });
                }}
              >
                Trigger Error
              </Button>
            </div>

            {/* Settings Update */}
            <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-text-primary">Settings Update</h3>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  toast.success('Settings saved successfully', {
                    description: 'Your preferences have been updated',
                  });
                }}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="rounded-lg border border-primary-500 bg-primary-50 p-6 dark:bg-primary-600/10">
          <h2 className="mb-4 border-b border-primary-500/30 pb-3 text-h2">Interactive Features</h2>
          <ul className="list-none space-y-3 p-0">
            <li>
              <strong>Auto-dismiss:</strong> Default 4 seconds, error messages 5 seconds
            </li>
            <li>
              <strong>Hover to Pause:</strong> Hover over any toast to pause the auto-dismiss timer
            </li>
            <li>
              <strong>Close Button:</strong> Click X button in top-right to manually dismiss
            </li>
            <li>
              <strong>Animations:</strong> Slide in from right (300ms), slide out to right (200ms)
            </li>
            <li>
              <strong>Stacking:</strong> Multiple toasts stack vertically with proper spacing
            </li>
            <li>
              <strong>Promise Mode:</strong> Automatically shows loading → success/error states
            </li>
            <li>
              <strong>Action Buttons:</strong> Add clickable buttons for user interaction
            </li>
            <li>
              <strong>Types:</strong> Success (green), Error (red), Warning (yellow), Info (blue)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
