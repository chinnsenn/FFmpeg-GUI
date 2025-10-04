import { useState } from 'react';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ModalClose,
} from '@renderer/components/ui/modal';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { AlertTriangle, Trash2, Settings, Info, CheckCircle2 } from 'lucide-react';

export default function ModalTest() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-h1 mb-2">Modal Components Demo</h1>
        <p className="text-text-secondary mb-8">
          Interactive demo of Modal/Dialog component with different sizes, animations, and use cases.
        </p>

        {/* Section 1: Basic Modals */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">1. Basic Modal</h2>
          <div className="flex gap-4">
            <Modal>
              <ModalTrigger asChild>
                <Button>Simple Modal</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Simple Modal</ModalTitle>
                  <ModalDescription>
                    This is a basic modal with title, description, and close button.
                  </ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-text-secondary">
                    Modal content goes here. You can add any React components or HTML elements.
                    Click outside, press Escape, or use the close button to dismiss.
                  </p>
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">With Footer</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Modal with Footer</ModalTitle>
                  <ModalDescription>This modal includes action buttons in the footer.</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-text-secondary mb-4">
                    This modal demonstrates a typical pattern with header, body, and footer sections.
                  </p>
                  <p className="text-sm text-text-secondary">
                    The footer typically contains action buttons like "Cancel" and "Confirm".
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </ModalClose>
                  <Button variant="primary">Confirm</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </section>

        {/* Section 2: Size Variants */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">2. Size Variants</h2>
          <div className="flex gap-4">
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">Small (sm)</Button>
              </ModalTrigger>
              <ModalContent size="sm">
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Small Modal</ModalTitle>
                  <ModalDescription>max-w-sm (384px)</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-text-secondary">
                    Small modals are best for simple confirmations or short messages.
                  </p>
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">Medium (md)</Button>
              </ModalTrigger>
              <ModalContent size="md">
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Medium Modal</ModalTitle>
                  <ModalDescription>max-w-md (448px) - Default size</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-text-secondary">
                    Medium is the default size, suitable for most use cases.
                  </p>
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">Large (lg)</Button>
              </ModalTrigger>
              <ModalContent size="lg">
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Large Modal</ModalTitle>
                  <ModalDescription>max-w-lg (512px)</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-text-secondary mb-3">
                    Large modals provide more space for complex content.
                  </p>
                  <p className="text-sm text-text-secondary">
                    Use for forms, detailed information, or multi-step workflows.
                  </p>
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">Extra Large (xl)</Button>
              </ModalTrigger>
              <ModalContent size="xl">
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Extra Large Modal</ModalTitle>
                  <ModalDescription>max-w-xl (576px)</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-text-secondary mb-3">
                    Extra large modals are ideal for extensive content, complex forms, or data tables.
                  </p>
                  <div className="p-4 bg-background-tertiary rounded-lg">
                    <p className="text-xs text-text-secondary">
                      Example: You could display detailed media information, conversion settings, or
                      a file browser in this size modal.
                    </p>
                  </div>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        </section>

        {/* Section 3: Controlled Modal */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">3. Controlled Modal (State Management)</h2>
          <div className="flex items-center gap-4">
            <Button onClick={() => setControlledOpen(true)}>Open Controlled Modal</Button>
            <span className="text-sm text-text-secondary">
              State: {controlledOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <Modal open={controlledOpen} onOpenChange={setControlledOpen}>
            <ModalContent>
              <ModalCloseButton />
              <ModalHeader>
                <ModalTitle>Controlled Modal</ModalTitle>
                <ModalDescription>
                  This modal is controlled by React state (open={controlledOpen.toString()})
                </ModalDescription>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-text-secondary mb-4">
                  You can programmatically control when the modal opens and closes by managing the
                  `open` state prop.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setControlledOpen(false)}
                >
                  Close Programmatically
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={() => setControlledOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </section>

        {/* Section 4: Real-World Use Cases */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">4. Real-World Use Cases</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Confirmation Dialog */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="destructive" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Delete Task
                </Button>
              </ModalTrigger>
              <ModalContent size="sm">
                <ModalCloseButton />
                <ModalHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-50 dark:bg-error-600/10">
                      <AlertTriangle className="h-5 w-5 text-error-600" />
                    </div>
                    <div>
                      <ModalTitle>Delete Task</ModalTitle>
                      <ModalDescription>This action cannot be undone</ModalDescription>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-text-secondary">
                    Are you sure you want to delete this task? All progress will be lost and the
                    output files will be removed.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </ModalClose>
                  <Button variant="destructive">Delete Task</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Settings Dialog */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" leftIcon={<Settings className="w-4 h-4" />}>
                  Task Settings
                </Button>
              </ModalTrigger>
              <ModalContent size="lg">
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Task Settings</ModalTitle>
                  <ModalDescription>Configure task execution options</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input label="Task Name" defaultValue="Video Conversion" />
                    <Input label="Priority" type="number" defaultValue="1" min="1" max="10" />
                    <Input label="Output Directory" defaultValue="/Users/output" />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autostart"
                        className="rounded border-border-medium"
                      />
                      <label htmlFor="autostart" className="text-sm text-text-secondary">
                        Auto-start when added to queue
                      </label>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </ModalClose>
                  <Button>Save Settings</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Info Dialog */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" leftIcon={<Info className="w-4 h-4" />}>
                  Media Info
                </Button>
              </ModalTrigger>
              <ModalContent size="lg">
                <ModalCloseButton />
                <ModalHeader>
                  <ModalTitle>Media File Information</ModalTitle>
                  <ModalDescription>video_sample.mp4</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">File Size:</span>
                      <span className="font-medium text-text-primary">24.8 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Duration:</span>
                      <span className="font-medium text-text-primary">00:02:34</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Resolution:</span>
                      <span className="font-medium text-text-primary">1920x1080</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Video Codec:</span>
                      <span className="font-medium text-text-primary">H.264</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Audio Codec:</span>
                      <span className="font-medium text-text-primary">AAC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Bitrate:</span>
                      <span className="font-medium text-text-primary">1500 kbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Frame Rate:</span>
                      <span className="font-medium text-text-primary">30 fps</span>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="secondary">Close</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Success Dialog */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Task Complete
                </Button>
              </ModalTrigger>
              <ModalContent size="sm">
                <ModalCloseButton />
                <ModalHeader>
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50 dark:bg-success-600/10 mb-3">
                      <CheckCircle2 className="h-6 w-6 text-success-600" />
                    </div>
                    <ModalTitle>Conversion Complete!</ModalTitle>
                    <ModalDescription>Your video has been successfully converted</ModalDescription>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Output File:</span>
                      <span className="font-medium text-text-primary">output.webm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Size:</span>
                      <span className="font-medium text-text-primary">18.4 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Duration:</span>
                      <span className="font-medium text-text-primary">1m 42s</span>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="secondary">Close</Button>
                  </ModalClose>
                  <Button>Open Folder</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </section>

        {/* Section 5: Form Modal */}
        <section className="mb-8">
          <h2 className="mb-4 text-h2">5. Form Modal</h2>
          <Modal>
            <ModalTrigger asChild>
              <Button>Create New Task</Button>
            </ModalTrigger>
            <ModalContent size="lg">
              <ModalCloseButton />
              <ModalHeader>
                <ModalTitle>Create New Task</ModalTitle>
                <ModalDescription>Fill in the details to create a new conversion task</ModalDescription>
              </ModalHeader>
              <ModalBody>
                <form className="space-y-4">
                  <Input
                    label="Task Name"
                    placeholder="My Conversion Task"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input label="Input File" type="file" />
                  <Input label="Output Format" placeholder="e.g., mp4, webm, avi" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Video Codec" placeholder="H.264" />
                    <Input label="Audio Codec" placeholder="AAC" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Resolution" placeholder="1920x1080" />
                    <Input label="Bitrate" placeholder="1500 kbps" />
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </ModalClose>
                <Button>Create Task</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </section>

        {/* Instructions */}
        <section className="rounded-lg border border-primary-500 bg-primary-50 p-6 dark:bg-primary-600/10">
          <h2 className="mb-4 border-b border-primary-500/30 pb-3 text-h2">Interactive Features</h2>
          <ul className="list-none space-y-3 p-0">
            <li>
              <strong>Open/Close:</strong> Click trigger button, overlay, close button, or press Escape
            </li>
            <li>
              <strong>Animations:</strong> Smooth fade-in + zoom-in + slide-in (200ms opening, 150ms closing)
            </li>
            <li>
              <strong>Focus Trap:</strong> Tab key cycles only within modal, cannot focus outside elements
            </li>
            <li>
              <strong>Scroll Lock:</strong> Background scrolling is prevented when modal is open
            </li>
            <li>
              <strong>Keyboard:</strong> Escape to close, Tab to navigate, Enter to activate focused button
            </li>
            <li>
              <strong>Accessibility:</strong> Full ARIA support (role="dialog", aria-modal, aria-labelledby)
            </li>
            <li>
              <strong>Sizes:</strong> sm (384px), md (448px), lg (512px), xl (576px)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
