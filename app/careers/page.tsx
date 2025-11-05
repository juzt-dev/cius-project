import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - CIUS',
  description: 'Join our team and build your career with CIUS',
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
      <p className="text-muted-foreground mb-8">
        We're always looking for talented individuals to join our growing team.
      </p>

      <div className="space-y-4">
        {['Senior Frontend Developer', 'Backend Engineer', 'Product Manager'].map(
          (position, idx) => (
            <div
              key={idx}
              className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{position}</h3>
              <p className="text-muted-foreground mb-4">Full-time • Remote</p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
                Apply Now
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
