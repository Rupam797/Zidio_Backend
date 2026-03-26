import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2, Send, Image as ImageIcon, Calendar, Newspaper, MoreHorizontal, Globe, Loader2 } from 'lucide-react';
import { getAllPosts, createPost, likePost, getComments, addComment } from '../api/posts';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 0, append = false) => {
    try {
      const data = await getAllPosts(pageNum, 10);
      // Backend returns PagedResponse<PostResponseDTO>
      const items = data.content || data;
      if (append) {
        setPosts(prev => [...prev, ...items]);
      } else {
        setPosts(items);
      }
      setHasMore(data.last === false);
      setPage(pageNum);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchPosts(page + 1, true);
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    setPosting(true);
    try {
      await createPost({ content: postText });
      setPostText('');
      setExpanded(false);
      fetchPosts(0, false);
    } catch (e) {
      console.error(e);
      alert('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Create Post */}
      <div className="card p-4">
        <div className="flex gap-3 items-center">
          <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg flex-shrink-0">
            {localStorage.getItem('email')?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button
            onClick={() => setExpanded(true)}
            className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 text-left px-4 py-2.5 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Start a post…
          </button>
        </div>

        {expanded && (
          <div className="mt-3 animate-fadeInUp">
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="What do you want to talk about?"
              className="input-field resize-none mb-3"
              rows={4}
              autoFocus
              maxLength={3000}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  <ImageIcon className="w-4 h-4" /> Photo
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-500 hover:bg-orange-50 transition-colors">
                  <Calendar className="w-4 h-4" /> Event
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                  <Newspaper className="w-4 h-4" /> Article
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-400">{postText.length}/3000</span>
                <button onClick={() => { setExpanded(false); setPostText(''); }} className="btn-outline py-1.5 px-4 text-xs">Cancel</button>
                <button onClick={handlePost} disabled={!postText.trim() || posting} className="btn-primary py-1.5 px-4 text-xs disabled:opacity-50">
                   {posting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {!expanded && (
          <div className="flex justify-around mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <PostAction Icon={ImageIcon} color="text-blue-500" label="Media" />
            <PostAction Icon={Calendar} color="text-orange-500" label="Event" />
            <PostAction Icon={Newspaper} color="text-red-500" label="Write article" />
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="flex items-center gap-2 px-1">
        <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1" />
        <span className="text-xs text-gray-500 whitespace-nowrap">
          Sort by: <span className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:underline">Top</span>
        </span>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4">
              <div className="flex gap-3 mb-3">
                <div className="skeleton w-11 h-11 rounded-full" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-32 mb-1" />
                  <div className="skeleton h-3 w-48" />
                </div>
              </div>
              <div className="skeleton h-3 w-full mb-1" />
              <div className="skeleton h-3 w-4/5" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No posts yet. Be the first to share!</div>
      ) : (
        <>
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} delay={i < 10 ? i * 0.05 : 0} onRefresh={() => fetchPosts(0)} />
          ))}
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="btn-outline w-full justify-center py-3 text-sm"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading more…
                </span>
              ) : 'Load More Posts'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

const PostAction = ({ Icon, color, label }) => (
  <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${color}`}>
    <Icon className="w-5 h-5" />
    <span className="hidden sm:block text-gray-600 dark:text-gray-400">{label}</span>
  </button>
);

const PostCard = ({ post, delay, onRefresh }) => {
  const [liked, setLiked] = useState(post.likedByCurrentUser || false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(post.id);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComment) fetchComments();
    setShowComment(!showComment);
  };

  const handleLike = async () => {
    // Optimistic toggle
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
    try {
      const result = await likePost(post.id);
      // Sync with server state
      if (result) {
        setLiked(result.likedByCurrentUser);
        setLikesCount(result.likeCount);
      }
    } catch (e) {
      // Revert on error
      setLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      console.error(e);
    }
  };

  const handleAddComment = async (e) => {
    if (e.key === 'Enter' && newComment.trim()) {
      try {
        const c = await addComment(post.id, { content: newComment });
        setComments([...comments, c]);
        setCommentCount(prev => prev + 1);
        setNewComment('');
      } catch (e) { console.error(e); }
    }
  };

  const timeDisplay = post.timeAgo || new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="card overflow-hidden animate-fadeInUp" style={{ animationDelay: `${delay}s` }}>
      {/* Header */}
      <div className="flex justify-between items-start p-4 pb-2">
        <div className="flex gap-3">
          <Link to="/profile">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {post.authorName?.charAt(0).toUpperCase() || '?'}
            </div>
          </Link>
          <div>
            <Link to="/profile" className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:text-zidio-green hover:underline block">
               {post.authorName || post.authorEmail}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">{post.authorEmail}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">{timeDisplay} · <Globe className="w-3 h-3" /></p>
          </div>
        </div>
        <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="border-y border-gray-100 dark:border-gray-700 max-h-[400px] overflow-hidden">
          <img src={post.imageUrl} alt="post media" className="w-full object-cover" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex justify-between text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
            <ThumbsUp className="w-2.5 h-2.5 text-white" />
          </div>
          {likesCount}
        </div>
        <span className="cursor-pointer hover:underline" onClick={handleToggleComments}>
          {commentCount > 0 ? `${commentCount} comment${commentCount !== 1 ? 's' : ''}` : 'Comment'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex px-2 py-1">
        <ActionBtn Icon={ThumbsUp} label="Like" active={liked} onClick={handleLike} />
        <ActionBtn Icon={MessageCircle} label="Comment" onClick={handleToggleComments} />
        <ActionBtn Icon={Share2} label="Share" />
        <ActionBtn Icon={Send} label="Send" />
      </div>

      {/* Comment Section */}
      {showComment && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 animate-fadeInUp">
          <div className="flex gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center font-bold text-xs text-emerald-700 dark:text-emerald-300 flex-shrink-0">
               {localStorage.getItem('email')?.charAt(0).toUpperCase() || 'U'}
            </div>
            <input 
              className="input-field py-1.5 text-sm flex-1 bg-white dark:bg-gray-800" 
              placeholder="Add a comment… (Press Enter)" 
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={handleAddComment}
            />
          </div>
          
          {loadingComments ? (
            <div className="text-xs text-center text-gray-400 py-2">Loading comments…</div>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-xs text-blue-700 dark:text-blue-300 flex-shrink-0 mt-1">
                     {c.authorName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 text-sm text-gray-800 dark:text-gray-200 p-2 rounded-lg rounded-tl-none flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="font-semibold text-xs">{c.authorName || c.authorEmail}</p>
                      {c.timeAgo && <span className="text-xs text-gray-400">{c.timeAgo}</span>}
                    </div>
                    <p>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({ Icon, label, active, onClick }) => (
  <button onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${active ? 'text-zidio-green' : 'text-gray-600 dark:text-gray-400'}`}>
    <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
    <span className="hidden sm:block">{label}</span>
  </button>
);

export default Feed;
