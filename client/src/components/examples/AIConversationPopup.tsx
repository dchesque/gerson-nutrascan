import { useState } from 'react';
import AIConversationPopup from '../AIConversationPopup';
import { Button } from '@/components/ui/button';

export default function AIConversationPopupExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>
        Open AI Conversation
      </Button>
      <AIConversationPopup
        open={open}
        onClose={() => setOpen(false)}
        onGoalSelect={(goal) => console.log('Goal selected:', goal)}
      />
    </div>
  );
}
