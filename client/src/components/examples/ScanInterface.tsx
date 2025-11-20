import ScanInterface from '../ScanInterface';

export default function ScanInterfaceExample() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <ScanInterface onAnalyze={(data) => console.log('Analysis requested:', data)} />
    </div>
  );
}
