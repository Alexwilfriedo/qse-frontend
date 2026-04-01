import { Badge, Button, Card, CardHeader, Select, SkeletonText } from '@/components/ui';
import { useUserName } from '@/features/admin/hooks/useUsers';
import { CheckCircle, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { useAddComment, useDocumentComments, useResolveComment } from '../hooks';
import type { CommentType, DocumentComment } from '../types';
import { COMMENT_TYPE_LABELS } from '../types';

interface DocumentCommentsPanelProps {
  documentId: string;
}

const COMMENT_TYPE_OPTIONS = (
  Object.entries(COMMENT_TYPE_LABELS) as [CommentType, string][]
).map(([value, label]) => ({ value, label }));

export function DocumentCommentsPanel({ documentId }: DocumentCommentsPanelProps) {
  const { data: comments, isLoading } = useDocumentComments(documentId);

  const unresolvedCount = (comments ?? []).filter((c) => !c.resolved).length;

  return (
    <Card>
      <CardHeader
        title={`Commentaires${comments ? ` (${comments.length})` : ''}`}
        action={
          unresolvedCount > 0 ? (
            <Badge variant='warning'>{unresolvedCount} non résolu{unresolvedCount > 1 ? 's' : ''}</Badge>
          ) : undefined
        }
      />
      <div className='p-6 space-y-4'>
        <AddCommentForm documentId={documentId} />

        {isLoading ? (
          <div className='space-y-2'>
            <SkeletonText className='h-16 w-full' />
            <SkeletonText className='h-16 w-full' />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className='space-y-2'>
            {comments.map((comment) => (
              <CommentRow key={comment.id} comment={comment} documentId={documentId} />
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500 text-center py-4'>
            Aucun commentaire.
          </p>
        )}
      </div>
    </Card>
  );
}

function AddCommentForm({ documentId }: { documentId: string }) {
  const [contenu, setContenu] = useState('');
  const [type, setType] = useState<CommentType>('COMMENT');
  const addComment = useAddComment();

  const handleSubmit = () => {
    if (!contenu.trim()) return;
    addComment.mutate(
      { id: documentId, data: { contenu: contenu.trim(), type } },
      { onSuccess: () => setContenu('') },
    );
  };

  return (
    <div className='rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3'>
      <div className='flex gap-3'>
        <div className='flex-1'>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder='Ajouter un commentaire...'
            rows={2}
            className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
          />
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <div className='w-48'>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as CommentType)}
            options={COMMENT_TYPE_OPTIONS}
          />
        </div>
        <Button
          size='sm'
          onClick={handleSubmit}
          disabled={!contenu.trim() || addComment.isPending}>
          <Send className='w-4 h-4 mr-1' />
          {addComment.isPending ? 'Envoi...' : 'Envoyer'}
        </Button>
      </div>
    </div>
  );
}

function CommentRow({
  comment,
  documentId,
}: {
  comment: DocumentComment;
  documentId: string;
}) {
  const userName = useUserName(comment.userId);
  const resolveComment = useResolveComment(documentId);

  const date = new Date(comment.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const typeLabel = COMMENT_TYPE_LABELS[comment.type] ?? comment.type;

  return (
    <div
      className={`p-3 rounded-lg border ${
        comment.resolved
          ? 'border-gray-100 dark:border-gray-800 opacity-60'
          : 'border-gray-200 dark:border-gray-700'
      }`}>
      <div className='flex items-start gap-3'>
        <MessageSquare className='w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0' />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-sm font-medium text-gray-900 dark:text-white'>
              {userName}
            </span>
            <Badge
              variant={
                comment.type === 'ANNOTATION'
                  ? 'info'
                  : comment.type === 'CONSULTATION'
                    ? 'warning'
                    : 'default'
              }
              className='text-xs'>
              {typeLabel}
            </Badge>
            {comment.resolved && (
              <Badge variant='success' className='text-xs'>
                Résolu
              </Badge>
            )}
            <span className='text-xs text-gray-400'>{date}</span>
          </div>
          <p className='text-sm text-gray-700 dark:text-gray-300 mt-1'>
            {comment.contenu}
          </p>
        </div>
        {!comment.resolved && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => resolveComment.mutate(comment.id)}
            disabled={resolveComment.isPending}
            title='Marquer comme résolu'>
            <CheckCircle className='w-4 h-4 text-green-500' />
          </Button>
        )}
      </div>
    </div>
  );
}
