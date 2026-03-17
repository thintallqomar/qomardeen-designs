import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, LogIn, UserPlus, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useComments, useCurrentUser } from '@/hooks/useComments';
import { supabase } from '@/integrations/supabase/client';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CommentsSectionProps {
  articleSlug: string;
}

const CommentsSection = ({ articleSlug }: CommentsSectionProps) => {
  const { comments, commentCount, isLoading, addComment, editComment, deleteComment } = useComments(articleSlug);
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [authMode, setAuthMode] = useState<'none' | 'login' | 'signup'>('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Signed in successfully!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split('@')[0] },
            emailRedirectTo: window.location.href,
          },
        });
        if (error) throw error;
        toast.success('Check your email to confirm your account!');
      }
      setAuthMode('none');
      setEmail('');
      setPassword('');
      setDisplayName('');
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.invalidateQueries({ queryKey: ['current-user'] });
    toast.success('Signed out');
  };

  const handleAddComment = async (data: { content: string; guest_name?: string; guest_email?: string; parent_id?: string }) => {
    try {
      await addComment.mutateAsync(data);
      toast.success('Comment posted!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to post comment');
    }
  };

  const handleEdit = async (id: string, content: string) => {
    try {
      await editComment.mutateAsync({ id, content });
      toast.success('Comment updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update comment');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment.mutateAsync(id);
      toast.success('Comment deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete comment');
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Discussion {commentCount > 0 && <span className="text-sm font-normal text-muted-foreground">({commentCount})</span>}
        </h3>

        {/* Auth controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs text-muted-foreground">
              <LogOut className="w-3.5 h-3.5 mr-1" /> Sign out
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthMode(authMode === 'login' ? 'none' : 'login')}
                className="text-xs"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" /> Sign in
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthMode(authMode === 'signup' ? 'none' : 'signup')}
                className="text-xs"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" /> Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Auth form */}
      {authMode !== 'none' && !user && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleAuth}
          className="mb-6 p-4 rounded-xl border border-border bg-secondary/30 space-y-3"
        >
          <h4 className="text-sm font-medium text-foreground">
            {authMode === 'login' ? 'Sign in to comment' : 'Create an account'}
          </h4>
          {authMode === 'signup' && (
            <Input
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
            />
          )}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={authLoading}>
              {authLoading && <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />}
              {authMode === 'login' ? 'Sign in' : 'Sign up'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setAuthMode('none')}>
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.form>
      )}

      {/* Comment form */}
      <div className="mb-8">
        <CommentForm onSubmit={handleAddComment} />
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleAddComment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentsSection;
