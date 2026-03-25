import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2, Send, Image as ImageIcon, Calendar, Newspaper, MoreHorizontal, Globe } from 'lucide-react';
import { getAllPosts, createPost, likePost, getComments, addComment } from '../api/posts';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!postText.trim()) return;
    setPosting(true);
    try {
      await createPost({ content: postText });
      setPostText('');
      setExpanded(false);
      fetchPosts();
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
            className="flex-1 rounded-full border border-gray-300 text-left px-4 py-2.5 text-gray-500 text-sm hover:bg-gray-50 transition-colors font-medium"
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
              <div className="flex gap-2">
                <button onClick={() => { setExpanded(false); setPostText(''); }} className="btn-outline py-1.5 px-4 text-xs">Cancel</button>
                <button onClick={handlePost} disabled={!postText.trim() || posting} className="btn-primary py-1.5 px-4 text-xs disabled:opacity-50">
                   {posting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {!expanded && (
          <div className="flex justify-around mt-3 pt-2 border-t border-gray-100">
            <PostAction Icon={ImageIcon} color="text-blue-500" label="Media" />
            <PostAction Icon={Calendar} color="text-orange-500" label="Event" />
            <PostAction Icon={Newspaper} color="text-red-500" label="Write article" />
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="flex items-center gap-2 px-1">
        <div className="h-px bg-gray-300 flex-1" />
        <span className="text-xs text-gray-500 whitespace-nowrap">
          Sort by: <span className="font-semibold text-gray-900 cursor-pointer hover:underline">Top</span>
        </span>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="card p-8 text-center text-gray-400">Loading feed…</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No posts yet. Be the first to share!</div>
      ) : (
        posts.map((post, i) => (
          <Post key={post.id} post={post} delay={i * 0.05} />
        ))
      )}
    </div>
  );
};

const PostAction = ({ Icon, color, label }) => (
  <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors ${color}`}>
    <Icon className="w-5 h-5" />
    <span className="hidden sm:block text-gray-600">{label}</span>
  </button>
);

const Post = ({ post, delay }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
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
    if (liked) return;
    setLiked(true);
    setLikesCount(prev => prev + 1);
    try { await likePost(post.id); } catch (e) { console.error(e); }
  };

  const handleAddComment = async (e) => {
    if (e.key === 'Enter' && newComment.trim()) {
      try {
        const c = await addComment(post.id, { content: newComment });
        setComments([...comments, c]);
        setNewComment('');
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div className="card overflow-hidden animate-fadeInUp" style={{ animationDelay: `${delay}s` }}>
      {/* Header */}
      <div className="flex justify-between items-start p-4 pb-2">
        <div className="flex gap-3">
          <Link to="/profile">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 bg-blue-100 text-blue-700">
              {post.authorName?.charAt(0).toUpperCase() || '?'}
            </div>
          </Link>
          <div>
            <Link to="/profile" className="font-semibold text-sm text-gray-900 hover:text-zidio-green hover:underline block">
               {post.authorName || post.authorEmail}
            </Link>
            <p className="text-xs text-gray-500">{post.authorEmail}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">{new Date(post.createdAt).toLocaleDateString()} · <Globe className="w-3 h-3" /></p>
          </div>
        </div>
        <button className="text-gray-400 hover:bg-gray-100 p-1 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="border-y border-gray-100 max-h-[400px] overflow-hidden">
          <img src={post.imageUrl} alt="post media" className="w-full object-cover" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex justify-between text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
            <ThumbsUp className="w-2.5 h-2.5 text-white" />
          </div>
          {likesCount}
        </div>
        <span className="cursor-pointer hover:underline" onClick={handleToggleComments}>
          {comments.length > 0 ? comments.length : ''} Comments
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
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50 animate-fadeInUp">
          <div className="flex gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-700 flex-shrink-0">
               {localStorage.getItem('email')?.charAt(0).toUpperCase() || 'U'}
            </div>
            <input 
              className="input-field py-1.5 text-sm flex-1 bg-white" 
              placeholder="Add a comment… (Press Enter to submit)" 
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
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-700 flex-shrink-0 mt-1">
                     {c.authorName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="bg-white border text-sm text-gray-800 p-2 rounded-lg rounded-tl-none flex-1">
                    <p className="font-semibold text-xs mb-0.5">{c.authorName || c.authorEmail}</p>
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
    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors ${active ? 'text-zidio-green' : 'text-gray-600'}`}>
    <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
    <span className="hidden sm:block">{label}</span>
  </button>
);

export default Feed;
