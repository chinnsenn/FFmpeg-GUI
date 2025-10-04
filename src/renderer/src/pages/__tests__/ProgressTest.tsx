import { useState, useEffect } from 'react';
import { Progress } from '@renderer/components/ui/progress';
import { Button } from '@renderer/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function ProgressTest() {
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(45);
  const [progress3, setProgress3] = useState(75);
  const [isRunning, setIsRunning] = useState(false);

  // 自动递增进度条（模拟任务进度）
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress1((prev) => {
        if (prev >= 100) {
          setIsRunning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setProgress1(0);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-h1">ProgressBar Component Demo</h1>
        <p className="mb-8 text-text-secondary">
          Interactive demo of Progress component with static, animated, and indeterminate modes.
        </p>

        {/* Section 1: Static Progress Bars */}
        <section className="mb-8 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">
            1. Static Progress Bars
          </h2>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">0% Progress</p>
              <Progress value={0} />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">25% Progress</p>
              <Progress value={25} showValue />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">50% Progress</p>
              <Progress value={50} showValue />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">75% Progress</p>
              <Progress value={75} showValue />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">100% Complete</p>
              <Progress value={100} showValue />
            </div>
          </div>
        </section>

        {/* Section 2: Shimmer Animated Progress */}
        <section className="mb-8 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">
            2. Shimmer Animated Progress
          </h2>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">
                Running Task (with shimmer animation)
              </p>
              <Progress value={progress2} animated showValue />
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setProgress2((prev) => Math.max(0, prev - 10))}
                >
                  -10%
                </Button>
                <Button
                  size="sm"
                  onClick={() => setProgress2((prev) => Math.min(100, prev + 10))}
                >
                  +10%
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Another Task (75% with shimmer)
              </p>
              <Progress value={progress3} animated showValue />
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setProgress3((prev) => Math.max(0, prev - 10))}
                >
                  -10%
                </Button>
                <Button
                  size="sm"
                  onClick={() => setProgress3((prev) => Math.min(100, prev + 10))}
                >
                  +10%
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Indeterminate Progress */}
        <section className="mb-8 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">
            3. Indeterminate Progress
          </h2>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">Preparing...</p>
              <Progress indeterminate />
              <p className="mt-1.5 text-xs text-text-tertiary">
                Used when progress cannot be determined
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Loading with text...</p>
              <Progress indeterminate showValue />
            </div>
          </div>
        </section>

        {/* Section 4: Interactive Simulation */}
        <section className="mb-8 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">
            4. Interactive Task Simulation
          </h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">
                Simulated Task Progress (auto-increment)
              </p>
              <Progress value={progress1} animated showValue />
            </div>

            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={handleStart} leftIcon={<Play className="h-4 w-4" />}>
                  Start
                </Button>
              ) : (
                <Button onClick={handlePause} leftIcon={<Pause className="h-4 w-4" />}>
                  Pause
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={handleReset}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Reset
              </Button>
            </div>

            <div className="rounded-md bg-background-tertiary p-4">
              <p className="text-sm">
                <span className="font-medium">Status: </span>
                {isRunning ? (
                  <span className="text-primary-600">Running...</span>
                ) : progress1 === 100 ? (
                  <span className="text-success-600">Completed!</span>
                ) : (
                  <span className="text-text-secondary">Paused</span>
                )}
              </p>
              <p className="text-sm">
                <span className="font-medium">Progress: </span>
                {progress1}%
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Size Variants */}
        <section className="mb-8 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">5. Size Variants</h2>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">Small (4px height)</p>
              <Progress value={60} size="sm" showValue />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Medium / Default (8px height)</p>
              <Progress value={60} size="md" showValue />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Large (12px height)</p>
              <Progress value={60} size="lg" showValue />
            </div>
          </div>
        </section>

        {/* Section 6: Real-world Use Cases */}
        <section className="mb-8 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">
            6. Real-world Use Cases
          </h2>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">
                Video Encoding - input.mp4 → output.mp4
              </p>
              <Progress value={67} animated showValue />
              <div className="mt-2 flex items-center justify-between text-xs text-text-tertiary">
                <span>Speed: 1.2x</span>
                <span>ETA: 2m 15s</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">
                Compression - movie.mov → movie.mp4
              </p>
              <Progress value={42} animated showValue />
              <div className="mt-2 flex items-center justify-between text-xs text-text-tertiary">
                <span>Speed: 0.8x</span>
                <span>ETA: 5m 32s</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">
                Initializing FFmpeg...
              </p>
              <Progress indeterminate />
              <div className="mt-2 text-xs text-text-tertiary">
                Please wait while FFmpeg prepares the task
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Edge Cases */}
        <section className="mb-8 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">7. Edge Cases</h2>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">
                Clamped to 0 (value = -10)
              </p>
              <Progress value={-10} showValue />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Clamped to 100 (value = 150)
              </p>
              <Progress value={150} showValue />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Custom max value (value = 50, max = 200)
              </p>
              <Progress value={50} max={200} showValue />
              <p className="mt-1 text-xs text-text-tertiary">
                Shows 25% (50/200)
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
