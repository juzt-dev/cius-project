import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download Report - CIUS',
  description: 'Download our latest industry report',
};

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Industry Report 2025</h1>
        <p className="text-muted-foreground mb-8">
          Get insights into the latest industry trends and market analysis.
        </p>

        <div className="border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Download Our Free Report</h2>
          <p className="text-muted-foreground mb-6">
            Enter your email to receive the full report in your inbox.
          </p>

          <form className="space-y-4">
            <div>
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              Download Report
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
