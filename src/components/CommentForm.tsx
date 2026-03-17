import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks/useComments';
import { MessageSquare, X, Loader2 } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (data: { content: string; guest_name?: string; guest_email?: string; parent_id?: string }) => Promise<void>;
  parentId?: string;
  onCancel?: () => void;
  isReply?: boolean;
}

const CommentForm = ({ onSubmit, parentId, onCancel, isReply = false }: CommentFormProps) => {
  const { data: user } = useCurrentUser();
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignedIn = !!user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        parent_id: parentId,
        ...(!isSignedIn && { guest_name: guestName.trim(), guest_email: guestEmail.trim() }),
      });
      setContent('');
      if (!isSignedIn) {
        setGuestName('');
        setGuestEmail('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = content.trim().length > 0 && (isSignedIn || guestName.trim().length > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!isSignedIn && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Name *"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            maxLength={100}
            required
          />
          <Input
            placeholder="Email (optional)"
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            maxLength={255}
          />
        </div>
      )}

      <Textarea
        placeholder={isReply ? 'Write a reply…' : 'Share your thoughts…'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={5000}
        rows={isReply ? 3 : 4}
        className="resize-none"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {isSignedIn ? `Commenting as ${user.profile?.display_name || user.email}` : 'Commenting as guest'}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
          )}
          <Button type="submit" size="sm" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5 mr-1" />}
            {isReply ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
