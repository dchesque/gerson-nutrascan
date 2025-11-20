import HistoryItem from '../HistoryItem';

export default function HistoryItemExample() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <HistoryItem
        id="1"
        productName="Premium Vitamin D3 + K2"
        brand="Nature Made"
        score={92}
        date="2 hours ago"
        onClick={() => console.log('Clicked item 1')}
      />
      <HistoryItem
        id="2"
        productName="Daily Multivitamin Complex"
        brand="Generic Brand"
        score={48}
        date="Yesterday"
        onClick={() => console.log('Clicked item 2')}
      />
      <HistoryItem
        id="3"
        productName="Omega-3 Fish Oil 1000mg"
        brand="Nordic Naturals"
        score={85}
        date="3 days ago"
        onClick={() => console.log('Clicked item 3')}
      />
    </div>
  );
}
