import React, { useState } from 'react';
import { Button, Card, ProgressBar, LoadingSpinner } from './index';

/**
 * Demo component showcasing all common UI components.
 * This file can be used for testing and documentation purposes.
 */
export const ComponentDemo: React.FC = () => {
  const [progress, setProgress] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleIncrement = () => {
    setProgress((prev) => Math.min(prev + 1, 10));
  };

  const handleReset = () => {
    setProgress(0);
  };

  const handleLoadingToggle = () => {
    setIsLoading((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Common UI Components Demo
        </h1>

        {/* Button Component Demo */}
        <Card title="Button Component">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => alert('Primary clicked!')}>
                  Primary Button
                </Button>
                <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
                  Secondary Button
                </Button>
                <Button variant="danger" onClick={() => alert('Danger clicked!')}>
                  Danger Button
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Sizes</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">States</h4>
              <div className="flex flex-wrap gap-3">
                <Button>Enabled</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Full Width</h4>
              <Button fullWidth variant="primary">
                Full Width Button
              </Button>
            </div>
          </div>
        </Card>

        {/* Card Component Demo */}
        <Card title="Card Component">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Basic Card</h4>
              <Card>
                <p className="text-slate-600">
                  This is a basic card with no title. It uses the Slate color system
                  and rounded-2xl corners for consistent styling.
                </p>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Hoverable Card</h4>
              <Card hoverable>
                <p className="text-slate-600">
                  Hover over this card to see the hover effect with shadow and slight lift.
                </p>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Clickable Card</h4>
              <Card onClick={() => alert('Card clicked!')} hoverable>
                <p className="text-slate-600">
                  This card is clickable. Click anywhere on it to trigger an action.
                </p>
              </Card>
            </div>
          </div>
        </Card>

        {/* ProgressBar Component Demo */}
        <Card title="ProgressBar Component">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Interactive Progress</h4>
              <ProgressBar current={progress} total={10} />
              <div className="flex gap-3 mt-4">
                <Button size="sm" onClick={handleIncrement}>
                  Increment
                </Button>
                <Button size="sm" variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Without Label</h4>
              <ProgressBar current={7} total={10} showLabel={false} />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Custom Color</h4>
              <ProgressBar current={8} total={10} color="bg-green-600" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Different Values</h4>
              <div className="space-y-3">
                <ProgressBar current={0} total={100} />
                <ProgressBar current={50} total={100} />
                <ProgressBar current={100} total={100} />
              </div>
            </div>
          </div>
        </Card>

        {/* LoadingSpinner Component Demo */}
        <Card title="LoadingSpinner Component">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Sizes</h4>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <LoadingSpinner size="sm" />
                  <p className="text-xs text-slate-600 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" />
                  <p className="text-xs text-slate-600 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-xs text-slate-600 mt-2">Large</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Custom Color</h4>
              <div className="flex items-center gap-8">
                <LoadingSpinner color="border-blue-600" />
                <LoadingSpinner color="border-green-600" />
                <LoadingSpinner color="border-red-600" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Loading State Toggle</h4>
              <Button onClick={handleLoadingToggle}>
                {isLoading ? 'Hide Loading' : 'Show Loading'}
              </Button>
              {isLoading && (
                <div className="mt-4 p-8 bg-slate-100 rounded-2xl">
                  <LoadingSpinner label="Loading content..." />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Accessibility Note */}
        <Card>
          <div className="text-sm text-slate-600 space-y-2">
            <p className="font-semibold text-slate-900">Accessibility Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All buttons meet minimum 44x44px touch target size</li>
              <li>Proper ARIA labels and roles for screen readers</li>
              <li>Keyboard navigation support with focus indicators</li>
              <li>Semantic HTML elements used throughout</li>
              <li>Color contrast meets WCAG guidelines</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComponentDemo;
