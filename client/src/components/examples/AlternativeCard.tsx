import AlternativeCard from '../AlternativeCard';

export default function AlternativeCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-4xl mx-auto">
      <AlternativeCard
        name="Premium Vitamin D3 + K2"
        brand="Nature Made"
        score={92}
        price={24.99}
        currentPrice={39.99}
        savings={15.00}
        url="https://amazon.com"
      />
      <AlternativeCard
        name="Complete Daily Multivitamin"
        brand="Garden of Life"
        score={88}
        price={32.50}
        location="Walgreens"
        distance="0.3 mi"
      />
      <AlternativeCard
        name="Ultra Omega-3 Fish Oil"
        brand="Nordic Naturals"
        score={85}
        price={28.99}
        currentPrice={34.99}
        savings={6.00}
        url="https://iherb.com"
      />
    </div>
  );
}
