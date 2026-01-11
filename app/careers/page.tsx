'use client';

import { useState } from 'react';
import { submitCareersAction } from '@/lib/actions';

export default function CareersPage() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('');

  const positions = ['Senior Frontend Developer', 'Backend Engineer', 'Product Manager'];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitCareersAction(formData);

    setIsPending(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      event.currentTarget.reset();
      setSelectedPosition('');
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
      <p className="text-muted-foreground mb-8">
        We're always looking for talented individuals to join our growing team.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Open Positions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
          {positions.map((position, idx) => (
            <div
              key={idx}
              className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{position}</h3>
              <p className="text-muted-foreground mb-4">Full-time • Remote</p>
              <button
                onClick={() => setSelectedPosition(position)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Application Form</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={isPending}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isPending}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium mb-2">
                Position
              </label>
              <select
                id="position"
                name="position"
                required
                disabled={isPending}
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              >
                <option value="">Select a position</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                disabled={isPending}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="Tell us why you'd be a great fit..."
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
              {isPending ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
