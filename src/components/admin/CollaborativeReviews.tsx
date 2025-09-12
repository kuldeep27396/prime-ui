import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ReviewComment {
  id: string;
  resource_type: string;
  resource_id: string;
  content: string;
  rating?: number;
  tags: string[];
  parent_comment_id?: string;
  thread_id?: string;
  is_private: boolean;
  is_resolved: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface CollaborativeReviewsProps {
  resourceType: string;
  resourceId: string;
  resourceTitle?: string;
}

export const CollaborativeReviews: React.FC<CollaborativeReviewsProps> = ({
  resourceType,
  resourceId,
  resourceTitle
}) => {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddComment, setShowAddComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    rating: 0,
    tags: [] as string[],
    is_private: false
  });

  useEffect(() => {
    fetchComments();
  }, [resourceType, resourceId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/v1/admin/reviews/${resourceType}/${resourceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch('/api/v1/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resource_type: resourceType,
          resource_id: resourceId,
          content: formData.content,
          rating: formData.rating || undefined,
          tags: formData.tags,
          is_private: formData.is_private,
          parent_comment_id: replyingTo || undefined
        })
      });

      if (response.ok) {
        await fetchComments();
        setShowAddComment(false);
        setReplyingTo(null);
        setFormData({
          content: '',
          rating: 0,
          tags: [],
          is_private: false
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const organizeComments = (comments: ReviewComment[]) => {
    const threads: Record<string, ReviewComment[]> = {};
    const rootComments: ReviewComment[] = [];

    comments.forEach(comment => {
      if (!comment.parent_comment_id) {
        rootComments.push(comment);
        threads[comment.id] = [];
      }
    });

    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        const threadId = comment.thread_id || comment.parent_comment_id;
        if (!threads[threadId]) {
          threads[threadId] = [];
        }
        threads[threadId].push(comment);
      }
    });

    return { rootComments, threads };
  };

  const { rootComments, threads } = organizeComments(comments);

  if (loading) {
    return <div className="flex justify-center p-4">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Reviews {resourceTitle && `for ${resourceTitle}`}
        </h3>
        <Button onClick={() => setShowAddComment(true)}>
          Add Review
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {rootComments.map((comment) => (
          <div key={comment.id}>
            {/* Root Comment */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">User {comment.author_id.slice(0, 8)}</span>
                    {comment.rating && renderStars(comment.rating)}
                    {comment.is_private && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-800 mb-2">{comment.content}</p>

                {comment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {comment.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  Reply
                </Button>
              </CardContent>
            </Card>

            {/* Replies */}
            {threads[comment.id] && threads[comment.id].length > 0 && (
              <div className="ml-8 mt-2 space-y-2">
                {threads[comment.id].map((reply) => (
                  <Card key={reply.id} className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">User {reply.author_id.slice(0, 8)}</span>
                          {reply.is_private && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Private
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{reply.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to add a review!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Comment Modal */}
      {(showAddComment || replyingTo) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {replyingTo ? 'Add Reply' : 'Add Review'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts..."
                />
              </div>

              {!replyingTo && (
                <div>
                  <label className="block text-sm font-medium mb-1">Rating (optional)</label>
                  {renderStars(formData.rating, true, (rating) => 
                    setFormData(prev => ({ ...prev, rating }))
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Tags (optional)</label>
                <Input
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagInput(e.target.value)}
                  placeholder="excellent, needs-improvement, follow-up (comma separated)"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_private}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_private: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Private comment (only visible to you)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddComment(false);
                  setReplyingTo(null);
                  setFormData({
                    content: '',
                    rating: 0,
                    tags: [],
                    is_private: false
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddComment}
                disabled={!formData.content.trim()}
              >
                {replyingTo ? 'Add Reply' : 'Add Review'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};