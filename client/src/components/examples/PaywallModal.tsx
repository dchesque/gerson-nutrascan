import { useState } from 'react';
import PaywallModal from '../PaywallModal';
import { Button } from '@/components/ui/button';

export default function PaywallModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>
        Open Paywall Modal
      </Button>
      <PaywallModal
        open={open}
        onClose={() => setOpen(false)}
        onSubscribe={() => {
          console.log('Subscribe clicked');
          setOpen(false);
        }}
      />
    </div>
  );
}
