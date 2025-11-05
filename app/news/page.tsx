import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News - CIUS',
  description: 'Latest news and updates from CIUS',
};

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Latest News</h1>
      <p className="text-muted-foreground mb-8">
        Stay updated with the latest news and announcements from CIUS.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <article
            key={item}
            className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-sm text-muted-foreground mb-2">Nov {item}, 2025</div>
            <h2 className="text-2xl font-semibold mb-3">News Article {item}</h2>
            <p className="text-muted-foreground mb-4">
              Brief description of the news article and its main points...
            </p>
            <a href="#" className="text-primary hover:underline">
              Read More →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
