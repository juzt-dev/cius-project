import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Offers - CIUS',
  description: 'Check out our latest offers and promotions',
};

export default function OfferPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Special Offers</h1>
      <p className="text-muted-foreground mb-8">
        Take advantage of our limited-time offers and exclusive deals.
      </p>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">Limited Time Offer!</h2>
        <p className="text-lg mb-4">Get 30% off on all enterprise packages</p>
        <button className="px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
          Claim Offer
        </button>
      </div>
    </div>
  );
}
