import React, { useState } from 'react';
import { Search, Mail } from 'lucide-react';
import { Input } from '@renderer/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@renderer/components/ui/radio';
import { Checkbox } from '@renderer/components/ui/checkbox';
import { Slider } from '@renderer/components/ui/slider';
import { FormLabel } from '@renderer/components/ui/form-label';

export default function FormTest() {
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('invalid-email');
  const [emailError, setEmailError] = useState('Please enter a valid email address');
  const [selectValue, setSelectValue] = useState('mp4');
  const [codecValue, setCodecValue] = useState('vp9');
  const [compressionMode, setCompressionMode] = useState('crf');
  const [preset, setPreset] = useState('medium');
  const [crfValue, setCrfValue] = useState([23]);
  const [bitrateValue, setBitrateValue] = useState([192]);
  const [checkboxStates, setCheckboxStates] = useState({
    autostart: true,
    notifications: false,
    keepFiles: true,
    overwrite: false,
    metadata: true,
    subtitle: false,
    thumbnail: true,
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailValue(value);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(value)) {
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address');
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-h1 mb-2">Form Components Demo</h1>
        <p className="text-text-secondary mb-8">
          Interactive demo of Input, Select, Radio, Checkbox, and Slider components with all states
          and interactions.
        </p>

        {/* Section 1: Input Fields */}
        <section className="mb-6 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">1. Input Fields</h2>

          <div className="space-y-6">
            <Input label="Default Input" placeholder="Enter text..." helperText="Standard input with placeholder" />

            <Input label="Input with Label" value={inputValue} onChange={(e) => setInputValue(e.target.value)} helperText="Input with pre-filled value" />

            <Input label="Input with Placeholder" placeholder="Type something here..." />

            <Input
              label="Input with Error State"
              type="email"
              value={emailValue}
              onChange={handleEmailChange}
              error={emailError}
            />

            <Input label="Disabled Input" defaultValue="Cannot edit this" disabled helperText="This input is disabled" />

            <Input
              label="Input with Left Icon"
              placeholder="Search..."
              leftIcon={<Search className="h-4 w-4" />}
              helperText="Input with search icon"
            />

            <Input
              label="Input with Right Icon"
              type="email"
              placeholder="your@email.com"
              rightIcon={<Mail className="h-4 w-4" />}
              helperText="Input with email icon"
            />

            <Input
              label="Monospace Input (File Path)"
              className="font-mono text-xs"
              defaultValue="/usr/local/bin/ffmpeg"
              placeholder="/path/to/file"
              helperText="Uses monospace font for technical values"
            />
          </div>
        </section>

        {/* Section 2: Select Dropdown */}
        <section className="mb-6 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">2. Select Dropdown</h2>

          <div className="space-y-6">
            <div>
              <FormLabel htmlFor="select-default">Default Select</FormLabel>
              <Select defaultValue="option1">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an option..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-text-tertiary">Select with default value (Option 1)</p>
            </div>

            <div>
              <FormLabel htmlFor="select-format">Output Format</FormLabel>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4 (H.264 + AAC)</SelectItem>
                  <SelectItem value="webm">WebM (VP9 + Opus)</SelectItem>
                  <SelectItem value="avi">AVI (MPEG-4)</SelectItem>
                  <SelectItem value="mkv">MKV (Matroska)</SelectItem>
                  <SelectItem value="mov">MOV (QuickTime)</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-text-tertiary">
                Selected: {selectValue.toUpperCase()} format with blue focus ring on click
              </p>
            </div>

            <div>
              <FormLabel htmlFor="select-codec">Video Codec</FormLabel>
              <Select value={codecValue} onValueChange={setCodecValue}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h264">H.264 (AVC)</SelectItem>
                  <SelectItem value="h265">H.265 (HEVC)</SelectItem>
                  <SelectItem value="vp9">VP9</SelectItem>
                  <SelectItem value="av1">AV1</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-text-tertiary">Selected: {codecValue.toUpperCase()} codec</p>
            </div>
          </div>
        </section>

        {/* Section 3: Radio Buttons */}
        <section className="mb-6 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">3. Radio Buttons</h2>

          <div className="space-y-6">
            <div>
              <FormLabel>Compression Mode</FormLabel>
              <RadioGroup value={compressionMode} onValueChange={setCompressionMode}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <RadioGroupItem value="crf" />
                  <div>
                    <div className="text-sm font-medium text-text-primary">CRF Quality Control</div>
                    <div className="text-xs text-text-secondary">
                      Constant Rate Factor - Better quality, variable file size
                    </div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <RadioGroupItem value="target-size" />
                  <div>
                    <div className="text-sm font-medium text-text-primary">Target File Size</div>
                    <div className="text-xs text-text-secondary">
                      Two-pass encoding - Predictable file size, variable quality
                    </div>
                  </div>
                </label>
              </RadioGroup>
              <p className="mt-1.5 text-xs text-text-tertiary">
                Selected: {compressionMode === 'crf' ? 'CRF Quality Control' : 'Target File Size'} (blue
                border + inner circle)
              </p>
            </div>

            <div className="h-px bg-border-light" />

            <div>
              <FormLabel>Encoding Preset</FormLabel>
              <RadioGroup value={preset} onValueChange={setPreset}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <RadioGroupItem value="slow" />
                  <div>
                    <div className="text-sm font-medium text-text-primary">Slow</div>
                    <div className="text-xs text-text-secondary">Best quality, longer encoding time</div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <RadioGroupItem value="medium" />
                  <div>
                    <div className="text-sm font-medium text-text-primary">Medium</div>
                    <div className="text-xs text-text-secondary">Balanced quality and speed</div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <RadioGroupItem value="fast" />
                  <div>
                    <div className="text-sm font-medium text-text-primary">Fast</div>
                    <div className="text-xs text-text-secondary">Lower quality, faster encoding</div>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>
        </section>

        {/* Section 4: Checkboxes */}
        <section className="mb-6 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">4. Checkboxes</h2>

          <div className="space-y-6">
            <div>
              <FormLabel>Task Settings</FormLabel>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <Checkbox
                    checked={checkboxStates.autostart}
                    onCheckedChange={(checked) =>
                      setCheckboxStates({ ...checkboxStates, autostart: checked as boolean })
                    }
                  />
                  <span className="text-sm text-text-primary">Auto-start next task</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <Checkbox
                    checked={checkboxStates.notifications}
                    onCheckedChange={(checked) =>
                      setCheckboxStates({ ...checkboxStates, notifications: checked as boolean })
                    }
                  />
                  <span className="text-sm text-text-primary">
                    Send notifications when tasks complete
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <Checkbox
                    checked={checkboxStates.keepFiles}
                    onCheckedChange={(checked) =>
                      setCheckboxStates({ ...checkboxStates, keepFiles: checked as boolean })
                    }
                  />
                  <span className="text-sm text-text-primary">
                    Keep original files after conversion
                  </span>
                </label>
              </div>
              <p className="mt-1.5 text-xs text-text-tertiary">
                Checked items have blue background with white checkmark
              </p>
            </div>

            <div className="h-px bg-border-light" />

            <div>
              <FormLabel>Output Options</FormLabel>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <Checkbox
                    checked={checkboxStates.overwrite}
                    onCheckedChange={(checked) =>
                      setCheckboxStates({ ...checkboxStates, overwrite: checked as boolean })
                    }
                  />
                  <span className="text-sm text-text-primary">Overwrite existing files</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <Checkbox
                    checked={checkboxStates.metadata}
                    onCheckedChange={(checked) =>
                      setCheckboxStates({ ...checkboxStates, metadata: checked as boolean })
                    }
                  />
                  <span className="text-sm text-text-primary">Preserve metadata</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <Checkbox
                    checked={checkboxStates.subtitle}
                    onCheckedChange={(checked) =>
                      setCheckboxStates({ ...checkboxStates, subtitle: checked as boolean })
                    }
                  />
                  <span className="text-sm text-text-primary">Include subtitles</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-background-tertiary">
                  <Checkbox
                    checked={checkboxStates.thumbnail}
                    onCheckedChange={(checked) =>
                      setCheckboxStates({ ...checkboxStates, thumbnail: checked as boolean })
                    }
                  />
                  <span className="text-sm text-text-primary">Generate thumbnail</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Slider */}
        <section className="mb-6 rounded-lg bg-surface-raised p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border-light pb-3 text-h2">5. Slider (CRF Quality)</h2>

          <div className="space-y-6">
            <div className="py-2">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">CRF Quality</span>
                <span className="text-base font-semibold text-primary-600">{crfValue[0]}</span>
              </div>
              <Slider
                value={crfValue}
                onValueChange={setCrfValue}
                min={18}
                max={32}
                step={1}
                className="mb-6"
              />
              <div className="flex justify-between text-center text-[11px] text-text-tertiary">
                <div className="flex-1 text-left">
                  <strong>18</strong>
                  <br />
                  High Quality
                  <br />
                  (Large file)
                </div>
                <div className="flex-1">
                  <strong>23</strong>
                  <br />
                  Recommended
                  <br />
                  (Balanced)
                </div>
                <div className="flex-1 text-right">
                  <strong>32</strong>
                  <br />
                  High Compression
                  <br />
                  (Small file)
                </div>
              </div>
              <p className="mt-4 text-xs text-text-tertiary">
                Lower values = better quality but larger files. Higher values = smaller files but lower
                quality. CRF 23 is recommended for most videos.
              </p>
            </div>

            <div className="h-px bg-border-light" />

            <div className="py-2">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">Audio Bitrate</span>
                <span className="text-base font-semibold text-primary-600">{bitrateValue[0]} kbps</span>
              </div>
              <Slider
                value={bitrateValue}
                onValueChange={setBitrateValue}
                min={96}
                max={320}
                step={32}
                className="mb-6"
              />
              <div className="flex justify-between text-center text-[11px] text-text-tertiary">
                <div className="flex-1 text-left">
                  <strong>96</strong>
                  <br />
                  Low Quality
                </div>
                <div className="flex-1">
                  <strong>192</strong>
                  <br />
                  Standard
                </div>
                <div className="flex-1 text-right">
                  <strong>320</strong>
                  <br />
                  High Quality
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="rounded-lg border border-primary-500 bg-primary-50 p-6 dark:bg-primary-600/10">
          <h2 className="mb-4 border-b border-primary-500/30 pb-3 text-h2">Interactive Features</h2>
          <ul className="list-none space-y-3 p-0">
            <li>
              <strong>Inputs:</strong> Hover for darker border, click to focus (blue ring), try typing in
              error/disabled states
            </li>
            <li>
              <strong>Select:</strong> Click to open dropdown, hover over options, selected option shows
              with checkmark
            </li>
            <li>
              <strong>Radio:</strong> Click to select, inner circle appears with animation, outer border
              turns blue
            </li>
            <li>
              <strong>Checkbox:</strong> Click to toggle, background turns blue with white checkmark
              animation
            </li>
            <li>
              <strong>Slider:</strong> Drag the thumb (hover scales up 1.1x), value updates in real-time,
              blue gradient fill shows current position
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
