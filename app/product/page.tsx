import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - CIUS',
  description: 'Explore our range of products and solutions',
};

export default function ProductPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Our Products</h1>
      <p className="text-muted-foreground mb-8">
        Discover our innovative solutions designed for modern businesses.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Product {item}</h3>
            <p className="text-muted-foreground mb-4">
              Description of product {item} and its key features.
            </p>
            <button className="text-primary hover:underline">Learn More →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
