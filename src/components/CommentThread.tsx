import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Reply, Pencil, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { Comment } from '@/hooks/useComments';
import { useCurrentUser } from '@/hooks/useComments';
import CommentForm from './CommentForm';

interface CommentThreadProps {
  comment: Comment;
  depth?: number;
  onReply: (data: { content: string; guest_name?: string; guest_email?: string; parent_id?: string }) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const MAX_VISIBLE_DEPTH = 4;

const CommentThread = ({ comment, depth = 0, onReply, onEdit, onDelete }: CommentThreadProps) => {
  const { data: user } = useCurrentUser();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [collapsed, setCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner = user?.id === comment.user_id;
  const displayName = comment.profile?.display_name || comment.guest_name || 'Anonymous';
  const avatarUrl = comment.profile?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasReplies = comment.replies && comment.replies.length > 0;
  const timeAgo = getTimeAgo(comment.created_at);

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={depth > 0 ? 'ml-4 sm:ml-8 pl-4 border-l border-border/50' : ''}
    >
      <div className="py-4">
        {/* Comment header */}
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 shrink-0">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground">{displayName}</span>
              {comment.user_id && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Member</span>
              )}
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
              {comment.is_edited && (
                <span className="text-xs text-muted-foreground italic">(edited)</span>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={5000}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEdit} disabled={saving || !editContent.trim()}>
                    {saving ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : null}
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setEditContent(comment.content); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words leading-relaxed">
                {comment.content}
              </p>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-1 mt-2">
                {depth < MAX_VISIBLE_DEPTH && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <Reply className="w-3.5 h-3.5 mr-1" /> Reply
                  </Button>
                )}
                {isOwner && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(comment.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </>
                )}
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    onClick={() => setCollapsed(!collapsed)}
                  >
                    {collapsed ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronUp className="w-3.5 h-3.5 mr-1" />}
                    {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
            )}

            {/* Reply form */}
            <AnimatePresence>
              {showReplyForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <CommentForm
                    parentId={comment.id}
                    isReply
                    onSubmit={async (data) => {
                      await onReply(data);
                      setShowReplyForm(false);
                    }}
                    onCancel={() => setShowReplyForm(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Nested replies */}
      <AnimatePresence>
        {!collapsed && hasReplies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {comment.replies!.map((reply) => (
              <CommentThread
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default CommentThread;
