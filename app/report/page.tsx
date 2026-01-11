'use client';

import { useState } from 'react';
import { submitReportAction } from '@/lib/actions';

export default function ReportPage() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitReportAction(formData);

    setIsPending(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      event.currentTarget.reset();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Industry Report 2026</h1>
        <p className="text-muted-foreground mb-8">
          Get insights into the latest industry trends and market analysis.
        </p>

        <div className="border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Download Our Free Report</h2>
          <p className="text-muted-foreground mb-6">
            Enter your email to receive the full report in your inbox.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending...' : 'Download Report'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Pages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">100+</div>
            <div className="text-sm text-muted-foreground">Data Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">10+</div>
            <div className="text-sm text-muted-foreground">Charts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
