import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - CIUS',
  description: 'Learn more about CIUS and our mission',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">About CIUS</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          CIUS is a leading provider of enterprise solutions, committed to delivering innovative
          products and services that help businesses thrive in the digital age.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10+</div>
            <div className="text-muted-foreground">Years of Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Team Members</div>
          </div>
        </div>
      </div>
    </div>
  );
}
