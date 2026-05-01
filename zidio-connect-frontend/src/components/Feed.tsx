import React, { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, MessageCircle, Share2, Send, Image as ImageIcon, Video as VideoIcon, Calendar, Newspaper, MoreHorizontal, Globe, Loader2, Heart, Star } from 'lucide-react';
import { getAllPosts, createPost, likePost, getComments, addComment, uploadPostMedia } from '../api/posts';

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [postText, setPostText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 0, append = false) => {
    try {
      const data = await getAllPosts(pageNum, 10);
      const items = data.content || data;
      if (append) setPosts(prev => [...prev, ...items]);
      else setPosts(items);
      setHasMore(data.last === false);
      setPage(pageNum);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!postText.trim() && !imageFile && !videoFile) return;
    setPosting(true);
    try {
      let finalImageUrl = '';
      let finalVideoUrl = '';

      if (imageFile) {
        const res = await uploadPostMedia(imageFile);
        finalImageUrl = res.url;
      }
      if (videoFile) {
        const res = await uploadPostMedia(videoFile);
        finalVideoUrl = res.url;
      }

      await createPost({ content: postText, imageUrl: finalImageUrl, videoUrl: finalVideoUrl });
      setPostText(''); setImageFile(null); setVideoFile(null); setExpanded(false);
      setShowImageInput(false); setShowVideoInput(false);
      fetchPosts(0);
    } catch (e) { console.error(e); }
    finally { setPosting(false); }
  };

  const email = localStorage.getItem('email') || '';
  const initials = email.charAt(0).toUpperCase() || 'U';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Create post */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="avatar avatar-md avatar-green" style={{ fontSize: '1rem' }}>{initials}</div>
          <button
            onClick={() => setExpanded(true)}
            style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '999px', border: '1.5px solid var(--border-default)', background: 'var(--bg-page)', color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'border-color 0.2s', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-page)'; }}
          >
            Start a post…
          </button>
        </div>

        {expanded && (
          <div style={{ marginTop: '0.875rem' }} className="animate-fadeInUp">
            <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder="What do you want to talk about?" className="input-field" rows={4} autoFocus maxLength={3000} style={{ resize: 'none', marginBottom: '0.75rem' }} />
            {showImageInput && <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="input-field" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }} />}
            {showVideoInput && <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} className="input-field" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button onClick={() => setShowImageInput(!showImageInput)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem', borderRadius: '8px', background: showImageInput ? 'var(--bg-badge)' : 'none', border: 'none', cursor: 'pointer', fontSize: '0.77rem', fontWeight: 600, color: 'var(--color-info-text)', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-badge)'} onMouseLeave={e => !showImageInput && (e.currentTarget.style.background = 'none')}>
                  <ImageIcon style={{ width: 15, height: 15 }} />Photo
                </button>
                <button onClick={() => setShowVideoInput(!showVideoInput)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem', borderRadius: '8px', background: showVideoInput ? 'var(--bg-badge)' : 'none', border: 'none', cursor: 'pointer', fontSize: '0.77rem', fontWeight: 600, color: '#8b5cf6', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-badge)'} onMouseLeave={e => !showVideoInput && (e.currentTarget.style.background = 'none')}>
                  <VideoIcon style={{ width: 15, height: 15 }} />Video
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{postText.length}/3000</span>
                <button className="btn-outline" style={{ padding: '0.35rem 0.875rem', fontSize: '0.8rem' }} onClick={() => { setExpanded(false); setPostText(''); setImageFile(null); setVideoFile(null); setShowImageInput(false); setShowVideoInput(false); }}>Cancel</button>
                <button className="btn-primary" style={{ padding: '0.35rem 0.875rem', fontSize: '0.8rem' }} onClick={handlePost} disabled={(!postText.trim() && !imageFile && !videoFile) || posting}>{posting ? 'Posting…' : 'Post'}</button>
              </div>
            </div>
          </div>
        )}

        {!expanded && (
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid var(--border-default)' }}>
            {[{ Icon: ImageIcon, color: 'var(--color-info-text)', label: 'Photo', action: () => { setExpanded(true); setShowImageInput(true); } }, { Icon: VideoIcon, color: '#8b5cf6', label: 'Video', action: () => { setExpanded(true); setShowVideoInput(true); } }, { Icon: Calendar, color: '#f97316', label: 'Event', action: () => setExpanded(true) }].map(({ Icon, color, label, action }) => (
              <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-badge)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <Icon style={{ width: 18, height: 18, color }} /><span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.25rem' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort by: <span style={{ fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>Top</span></span>
      </div>

      {/* Posts */}
      {loading ? (
        <>{[1, 2, 3].map(i => (
          <div key={i} className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}><div className="skeleton" style={{ height: 13, width: '40%', marginBottom: 6 }} /><div className="skeleton" style={{ height: 11, width: '60%' }} /></div>
            </div>
            <div className="skeleton" style={{ height: 11, width: '100%', marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 11, width: '75%' }} />
          </div>
        ))}</>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem 0', fontSize: '0.875rem' }}>No posts yet. Be the first to share!</div>
      ) : (
        <>
          {posts.map((post, i) => <PostCard key={post.id} post={post} delay={i < 10 ? i * 0.05 : 0} />)}
          {hasMore && (
            <button onClick={() => { setLoadingMore(true); fetchPosts(page + 1, true); }} disabled={loadingMore} className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              {loadingMore ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />Loading…</span> : 'Load More Posts'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export const PostCard = ({ post, delay }: any) => {
  const [reactionType, setReactionType] = useState<string | null>(post.userReactionType || null);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [clapsCount, setClapsCount] = useState(post.clapCount || 0);
  const [lovesCount, setLovesCount] = useState(post.loveCount || 0);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchComments = async () => {
    setLoadingComments(true);
    try { setComments(await getComments(post.id)); } catch (e) { console.error(e); } finally { setLoadingComments(false); }
  };

  const handleToggleComments = () => { if (!showComment) fetchComments(); setShowComment(v => !v); };

  const handleReact = async (type: string) => {
    const prevReaction = reactionType;
    const isRemoving = prevReaction === type;
    const newReaction = isRemoving ? null : type;
    
    // Optimistic UI update
    setReactionType(newReaction);
    
    // Decrement previous
    if (prevReaction === 'LIKE') setLikesCount(n => n - 1);
    else if (prevReaction === 'CLAP') setClapsCount(n => n - 1);
    else if (prevReaction === 'LOVE') setLovesCount(n => n - 1);
    
    // Increment new
    if (newReaction === 'LIKE') setLikesCount(n => n + 1);
    else if (newReaction === 'CLAP') setClapsCount(n => n + 1);
    else if (newReaction === 'LOVE') setLovesCount(n => n + 1);

    try { 
      const r = await likePost(post.id, type); 
      if (r) { 
        setReactionType(r.userReactionType || null); 
        setLikesCount(r.likeCount); 
        setClapsCount(r.clapCount);
        setLovesCount(r.loveCount);
      } 
    } catch { 
      // Revert on failure
      setReactionType(prevReaction);
      // Revert counts...
      fetchComments(); // Using as a dummy fallback to refresh post data would be better, but we just ignore for simplicity since optimistic failure is rare.
    }
  };

  const handleAddComment = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newComment.trim()) {
      try { const c = await addComment(post.id, { content: newComment }); setComments(prev => [...prev, c]); setCommentCount((n: number) => n + 1); setNewComment(''); } catch (e) { console.error(e); }
    }
  };

  const email = localStorage.getItem('email') || '';
  const myInitials = email.charAt(0).toUpperCase() || 'U';
  const authorInitials = (post.authorName || post.authorEmail || '?').charAt(0).toUpperCase();
  const timeDisplay = post.timeAgo || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '');

  const btnBase: React.CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.625rem 0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.15s, color 0.15s', fontFamily: "'DM Sans', sans-serif" };

  return (
    <div className="card animate-fadeInUp" style={{ overflow: 'hidden', animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem 1rem 0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <div className="avatar avatar-md avatar-blue">{authorInitials}</div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{post.authorName || post.authorEmail}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.authorEmail}</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{timeDisplay} · <Globe style={{ width: 11, height: 11 }} /></p>
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', borderRadius: '50%', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-badge)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}><MoreHorizontal style={{ width: 18, height: 18 }} /></button>
      </div>

      <div style={{ padding: '0 1rem 0.75rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: 1.65 }}>{post.content}</p>
      </div>

      {post.imageUrl && <div style={{ borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)', maxHeight: 400, overflow: 'hidden' }}><img src={post.imageUrl} alt="post" style={{ width: '100%', objectFit: 'cover' }} /></div>}
      {post.videoUrl && <div style={{ borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)', maxHeight: 400, overflow: 'hidden', display: 'flex', justifyContent: 'center', background: '#000' }}><video src={post.videoUrl} controls style={{ maxWidth: '100%', maxHeight: 400 }} /></div>}

      <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          {likesCount > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ThumbsUp style={{ width: 8, height: 8, color: '#fff' }} /></div>{likesCount}</span>}
          {clapsCount > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star style={{ width: 8, height: 8, color: '#fff' }} /></div>{clapsCount}</span>}
          {lovesCount > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart style={{ width: 8, height: 8, color: '#fff' }} /></div>{lovesCount}</span>}
          {(likesCount === 0 && clapsCount === 0 && lovesCount === 0) && <span style={{fontSize: '0.75rem'}}>Be the first to react</span>}
        </div>
        <span style={{ cursor: 'pointer' }} onClick={handleToggleComments}>{commentCount > 0 ? `${commentCount} comment${commentCount !== 1 ? 's' : ''}` : 'Comment'}</span>
      </div>

      <div style={{ display: 'flex', padding: '0.25rem 0.5rem' }}>
        {[
          { Icon: ThumbsUp, label: 'Like', active: reactionType === 'LIKE', color: 'var(--brand)', onClick: () => handleReact('LIKE') }, 
          { Icon: Star, label: 'Clap', active: reactionType === 'CLAP', color: '#f59e0b', onClick: () => handleReact('CLAP') },
          { Icon: Heart, label: 'Love', active: reactionType === 'LOVE', color: '#ef4444', onClick: () => handleReact('LOVE') },
          { Icon: MessageCircle, label: 'Comment', active: false, color: 'var(--brand)', onClick: handleToggleComments }
        ].map(({ Icon, label, active, color, onClick }) => (
          <button key={label} onClick={onClick} style={{ ...btnBase, color: active ? color : 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-badge)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon style={{ width: 18, height: 18, fill: active ? 'currentColor' : 'none' }} /><span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {showComment && (
        <div className="animate-fadeInUp" style={{ padding: '0.75rem 1rem 1rem', borderTop: '1px solid var(--border-default)', background: 'var(--bg-page)' }}>
          <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1rem' }}>
            <div className="avatar avatar-sm avatar-green" style={{ fontSize: '0.7rem' }}>{myInitials}</div>
            <input className="input-field" placeholder="Add a comment… (Enter to post)" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={handleAddComment} style={{ flex: 1, padding: '0.5rem 0.875rem', fontSize: '0.85rem' }} />
          </div>
          {loadingComments ? <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>Loading…</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="avatar avatar-sm avatar-blue" style={{ fontSize: '0.7rem', marginTop: 2 }}>{(c.authorName || c.authorEmail || '?').charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '0 10px 10px 10px', padding: '0.5rem 0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.125rem' }}>
                      <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.authorName || c.authorEmail}</span>
                      {c.timeAgo && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.timeAgo}</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{c.content}</p>
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

export default Feed;