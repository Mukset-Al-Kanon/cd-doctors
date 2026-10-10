'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  Loader2, 
  Send,
  CornerDownRight,
  Sparkles
} from 'lucide-react';

interface CommentItem {
  id: string;
  postId: string;
  userName: string;
  userAvatar?: string | null;
  content: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  parentId?: string | null;
  replies?: CommentItem[];
  _count?: {
    replies: number;
  };
}

interface DoctorPostCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  doctorName?: string;
  doctorUsername?: string;
  initialCommentsCount?: number;
  onCommentsCountChange?: (newCount: number) => void;
  onRequireLogin?: () => void;
  isLoggedIn?: boolean;
}


function isBengaliText(text: string): boolean {
  const banglaChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const totalChars = text.replace(/\s+/g, '').length;
  return totalChars > 0 && banglaChars / totalChars > 0.4;
}

function formatInstagramTime(dateString: string): string {
  try {
    const now = Date.now();
    const past = new Date(dateString).getTime();
    if (isNaN(past)) return '1d';
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}d`;
    const diffWeek = Math.floor(diffDay / 7);
    if (diffWeek < 52) return `${diffWeek}w`;
    const diffYear = Math.floor(diffWeek / 52);
    return `${diffYear}y`;
  } catch {
    return '1w';
  }
}

export default function DoctorPostCommentsModal({
  isOpen,
  onClose,
  postId,
  doctorName = 'Doctor',
  doctorUsername = 'dr.consultant',
  initialCommentsCount = 0,
  onCommentsCountChange,
  onRequireLogin,
  isLoggedIn = false,
}: DoctorPostCommentsModalProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<CommentItem | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [translatedComments, setTranslatedComments] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});
  const [showingOriginal, setShowingOriginal] = useState<Record<string, boolean>>({});

  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isClosing, setIsClosing] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsSnapping(false);
      setDragOffsetY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleRequestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 480);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    dragOffsetRef.current = 0;
    setDragOffsetY(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) {
      dragOffsetRef.current = deltaY;
      setDragOffsetY(deltaY);
    } else {
      const resistance = deltaY * 0.15;
      dragOffsetRef.current = resistance;
      setDragOffsetY(resistance);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const deltaY = dragOffsetRef.current;
    if (deltaY < 6) {
      handleRequestClose();
      return;
    }

    if (deltaY >= 50) {
      handleRequestClose();
    } else {
      setIsSnapping(true);
      setDragOffsetY(0);
      setTimeout(() => {
        setIsSnapping(false);
      }, 340);
    }
  };

  // Close on Escape key with smooth exit animation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch comments when modal opens
  useEffect(() => {
    if (!isOpen || !postId) return;

    let isMounted = true;
    async function loadComments() {
      try {
        setLoading(true);
        const res = await fetch(`/api/doctor/posts/comments?postId=${postId}&sort=newest`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && isMounted) {
          if (data.comments && data.comments.length > 0) {
            setComments(data.comments);
            if (onCommentsCountChange) onCommentsCountChange(data.count || data.comments.length);
          } else {
            // High fidelity initial Instagram comments matching user reference
            const sampleComments: CommentItem[] = [
              {
                id: 'sample-1',
                postId,
                userName: 'codernormie',
                userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                content: 'ডাক্তার সাহেবের পরামর্শগুলো সবসময় খুব উপকারী হয়। বিশেষ করে রক্তচাপ নিয়ন্ত্রণ ও নিয়মিত খাদ্যতালিকা সম্পর্কিত নির্দেশনাগুলো দারুণ কার্যকর। 👏❤️',
                likesCount: 86,
                dislikesCount: 0,
                createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(), // 2w
                _count: { replies: 8 },
                replies: [
                  {
                    id: 'sample-1-reply-1',
                    postId,
                    userName: doctorUsername,
                    userAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
                    content: 'অনেক ধন্যবাদ! নিয়মিত ওষুধ সেবন এবং হালকা ব্যায়াম চালিয়ে যাবেন। সুস্থ থাকুন।',
                    likesCount: 24,
                    dislikesCount: 0,
                    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
                  },
                ],
              },
              {
                id: 'sample-2',
                postId,
                userName: 'suvo20_05',
                userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
                content: 'খুবই সহজ ও সাবলীল উপস্থাপনা। গ্রামের মানুষদের জন্যও বিষয়টি বোঝা অনেক সহজ হলো।',
                likesCount: 24,
                dislikesCount: 0,
                createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(), // 1w
                _count: { replies: 0 },
                replies: [],
              },
              {
                id: 'sample-3',
                postId,
                userName: 'tania_rahman',
                userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                content: 'ডায়াবেটিস রোগীদের ক্ষেত্রে ব্লাড সুগার মনিটরিং নিয়ে যদি একটি বিস্তারিত ভিডিও দিতেন তাহলে খুব ভালো হতো স্যার।',
                likesCount: 19,
                dislikesCount: 0,
                createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2d
                _count: { replies: 0 },
                replies: [],
              },
            ];
            setComments(sampleComments);
            if (onCommentsCountChange) onCommentsCountChange(sampleComments.length);
          }
        }
      } catch (err) {
        console.error('Error fetching post comments:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [isOpen, postId]);

  // Handle Like/Unlike
  const handleLike = async (commentId: string) => {
    const currentlyLiked = Boolean(likedComments[commentId]);
    const nextState = !currentlyLiked;

    // Optimistic UI update
    setLikedComments((prev) => ({ ...prev, [commentId]: nextState }));
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likesCount: nextState ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? {
                    ...r,
                    likesCount: nextState ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
                  }
                : r
            ),
          };
        }
        return c;
      })
    );

    try {
      await fetch('/api/doctor/posts/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          type: nextState ? 'LIKE' : 'NONE',
        }),
      });
    } catch (err) {
      console.error('Error reacting to comment:', err);
    }
  };

  // Handle Submit Comment / Reply
  const handleSendComment = async () => {
    const text = commentText.trim();
    if (!text || submitting) return;

    if (!isLoggedIn && onRequireLogin) {
      onRequireLogin();
      return;
    }

    try {
      setSubmitting(true);
      const parentId = replyingTo ? replyingTo.id : undefined;

      const res = await fetch('/api/doctor/posts/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: text,
          parentId,
          userName: 'Anonymous Patient',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        }),
      });

      const data = await res.json();
      if (data.success && data.comment) {
        if (parentId) {
          setComments((prev) =>
            prev.map((c) => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), data.comment],
                  _count: {
                    replies: (c._count?.replies || 0) + 1,
                  },
                };
              }
              return c;
            })
          );
          setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
        } else {
          setComments((prev) => [data.comment, ...prev]);
        }

        setCommentText('');
        setReplyingTo(null);

        // Update overall count
        if (onCommentsCountChange) {
          onCommentsCountChange((initialCommentsCount || comments.length) + 1);
        }
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTranslate = async (commentId: string, originalContent: string) => {
    // If translation is already loaded, just toggle view between translated and original
    if (translatedComments[commentId]) {
      setShowingOriginal((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      return;
    }

    // Otherwise fetch translation from /api/translate
    try {
      setTranslatingIds((prev) => ({ ...prev, [commentId]: true }));
      const res = await fetch(`/api/translate?text=${encodeURIComponent(originalContent)}&target=bn`);
      const data = await res.json();
      if (data.success && data.translation) {
        setTranslatedComments((prev) => ({
          ...prev,
          [commentId]: data.translation,
        }));
        setShowingOriginal((prev) => ({
          ...prev,
          [commentId]: false,
        }));
      }
    } catch (err) {
      console.error('Error translating comment:', err);
    } finally {
      setTranslatingIds((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden ${
        isClosing ? 'animate-backdrop-fade-out pointer-events-none' : 'animate-backdrop-fade'
      }`}
      style={
        isDragging
          ? { opacity: Math.max(0.2, 1 - dragOffsetY / 500), transition: 'none' }
          : undefined
      }
      onClick={handleRequestClose}
    >
      {/* Bottom Sheet Drawer Modal (Matches Instagram Mobile / Web Drawer) */}
      <div 
        className={`relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[640px] max-h-[92vh] overflow-hidden border-t sm:border border-slate-200/80 font-sans ${
          isClosing 
            ? 'sheet-dismissing' 
            : isSnapping 
            ? 'sheet-snapping-back' 
            : isDragging 
            ? '' 
            : 'animate-sheet-up'
        }`}
        style={
          isDragging
            ? { transform: `translate3d(0, ${dragOffsetY}px, 0)`, transition: 'none' }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Drag Pill Bar (Top Center Handle - Hold & Drag to Minimize) */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="pt-3 pb-1.5 px-6 flex justify-center shrink-0 cursor-grab active:cursor-grabbing select-none touch-none group"
          title="Drag down to minimize or click to close"
        >
          <div className="w-12 h-1.5 bg-slate-300 group-hover:bg-slate-400 group-active:bg-slate-500 rounded-full transition-colors pointer-events-none" />
        </div>

        {/* 2. Modal Header (Also Draggable) */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative px-4 py-2 border-b border-slate-100 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
        >
          <h2 className="font-bold text-[15px] sm:text-base text-[#262626] tracking-tight pointer-events-none">
            Comments
          </h2>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleRequestClose}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150 cursor-pointer active:scale-90"
            title="Close"
            aria-label="Close comments modal"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* 3. Comments List Feed (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 text-[#262626] overscroll-contain">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400 stroke-[2.2]" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="font-bold text-slate-800 text-sm">No comments yet</p>
              <p className="text-xs text-slate-400">Be the first to start the conversation.</p>
            </div>
          ) : (
            comments.map((comment) => {
              const isLiked = Boolean(likedComments[comment.id]);
              const isTranslated = Boolean(translatedComments[comment.id] && !showingOriginal[comment.id]);
              const isTranslating = Boolean(translatingIds[comment.id]);
              const isBangla = isBengaliText(comment.content);
              const displayText = isTranslated ? translatedComments[comment.id] : comment.content;
              const hasReplies = Boolean(
                (comment.replies && comment.replies.length > 0) ||
                (comment._count?.replies && comment._count.replies > 0)
              );
              const repliesCount = (comment.replies && comment.replies.length) || (comment._count?.replies) || 0;
              const isExpanded = Boolean(expandedReplies[comment.id]);
              const isAuthor = comment.userName.toLowerCase().includes('dr.') || comment.userName.toLowerCase() === doctorUsername.toLowerCase();

              return (
                <div key={comment.id} className="space-y-2.5 relative">
                  {/* Top-Level Comment Row */}
                  <div className="flex items-start gap-3 relative">
                    {/* User Circular Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200/80 shrink-0 mt-0.5 relative z-10">
                      <img
                        src={comment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                        alt={comment.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Vertical Trunk Line from Parent Avatar Bottom down into the replies section (with generous overlap) */}
                    {Boolean(hasReplies) && isExpanded && (
                      <div className="absolute left-[15px] top-8 -bottom-8 w-[1.5px] bg-slate-200 z-0 pointer-events-none" />
                    )}

                    {/* Comment Body (Middle) */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                        <span className="font-bold text-[13px] text-[#262626] hover:underline cursor-pointer">
                          {comment.userName}
                        </span>
                        <span className="text-[12px] text-[#737373] font-normal">
                          {formatInstagramTime(comment.createdAt)}
                        </span>
                        {isAuthor && (
                          <span className="inline-flex items-center text-[10.5px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded-full leading-tight">
                            Author 📌
                          </span>
                        )}
                      </div>

                      {/* Comment Text */}
                      <p className="text-[13px] sm:text-[13.5px] text-[#262626] leading-relaxed mt-0.5 break-words font-normal">
                        {displayText}
                      </p>

                      {/* Sub-actions: Reply + See translation */}
                      <div className="flex items-center gap-3.5 mt-1 text-[11.5px] font-semibold text-[#737373]">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(comment);
                            if (inputRef.current) inputRef.current.focus();
                          }}
                          className="hover:text-[#262626] cursor-pointer transition-colors"
                        >
                          Reply
                        </button>
                        {!isBangla && (
                          <button
                            type="button"
                            onClick={() => handleToggleTranslate(comment.id, comment.content)}
                            disabled={isTranslating}
                            className="hover:text-[#262626] cursor-pointer transition-colors inline-flex items-center gap-1"
                          >
                            {isTranslating ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
                                <span>Translating...</span>
                              </>
                            ) : isTranslated ? (
                              <span>See original</span>
                            ) : (
                              <span>See translation</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Heart Icon + Likes Count Underneath */}
                    <div className="flex flex-col items-center shrink-0 pt-0.5 select-none w-8">
                      <button
                        type="button"
                        onClick={() => handleLike(comment.id)}
                        className="p-1 text-[#737373] hover:text-rose-600 active:scale-75 transition-all cursor-pointer"
                        title="Like"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                            isLiked
                              ? 'fill-rose-600 text-rose-600'
                              : 'text-[#737373] hover:text-[#262626] stroke-[1.8]'
                          }`}
                        />
                      </button>
                      {Boolean(comment.likesCount > 0) && (
                        <span className="text-[10px] font-medium text-[#737373] leading-none mt-0.5">
                          {comment.likesCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nested Replies Trigger (—— View N more replies) */}
                  {Boolean(hasReplies) && (
                    <div className="pl-10 relative">
                      <button
                        type="button"
                        onClick={() => toggleReplies(comment.id)}
                        className="flex items-center gap-2 text-[12px] font-semibold text-[#737373] hover:text-[#262626] transition-colors cursor-pointer py-1"
                      >
                        <span className="w-6 h-px bg-slate-300 inline-block shrink-0" />
                        <span>{isExpanded ? 'Hide replies' : `View ${repliesCount} more replies`}</span>
                      </button>

                      {/* Expanded Sub-replies List */}
                      {isExpanded && comment.replies && comment.replies.length > 0 && (
                        <div className="space-y-3.5 pt-2 relative">
                          {comment.replies.map((reply, rIdx) => {
                            const isReplyLiked = Boolean(likedComments[reply.id]);
                            const isReplyAuthor = reply.userName.toLowerCase().includes('dr.') || reply.userName.toLowerCase() === doctorUsername.toLowerCase();
                            const isFirstReply = rIdx === 0;
                            const hasNextReply = rIdx < (comment.replies?.length ?? 0) - 1;

                            return (
                              <div key={reply.id} className="relative flex items-start gap-2.5">
                                {/* 🌟 Continuous curved branch connecting from parent line into first reply */}
                                {isFirstReply && (
                                  <div className="absolute -left-[25px] -top-10 w-[25px] h-[38px] border-l-[1.5px] border-b-[1.5px] border-slate-200 rounded-bl-xl pointer-events-none z-0" />
                                )}

                                {/* 🌟 Vertical line connecting this reply down to the next reply */}
                                {hasNextReply && (
                                  <div className="absolute left-[13px] top-7 -bottom-4 w-[1.5px] bg-slate-200 z-0 pointer-events-none" />
                                )}

                                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0 mt-0.5 relative z-10">
                                  <img
                                    src={reply.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                                    alt={reply.userName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                                    <span className="font-bold text-[12.5px] text-[#262626]">
                                      {reply.userName}
                                    </span>
                                    <span className="text-[11px] text-[#737373] font-normal">
                                      {formatInstagramTime(reply.createdAt)}
                                    </span>
                                    {isReplyAuthor && (
                                      <span className="inline-flex items-center text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded-full leading-tight">
                                        Author 📌
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[12.5px] sm:text-[13px] text-[#262626] leading-relaxed mt-0.5 break-words font-normal">
                                    {translatedComments[reply.id] && !showingOriginal[reply.id]
                                      ? translatedComments[reply.id]
                                      : reply.content}
                                  </p>
                                  {/* Sub-actions: Reply + See translation */}
                                  <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold text-[#737373]">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReplyingTo(comment);
                                        if (inputRef.current) inputRef.current.focus();
                                      }}
                                      className="hover:text-[#262626] cursor-pointer transition-colors"
                                    >
                                      Reply
                                    </button>
                                    {!isBengaliText(reply.content) && (
                                      <button
                                        type="button"
                                        onClick={() => handleToggleTranslate(reply.id, reply.content)}
                                        disabled={Boolean(translatingIds[reply.id])}
                                        className="hover:text-[#262626] cursor-pointer transition-colors inline-flex items-center gap-1"
                                      >
                                        {translatingIds[reply.id] ? (
                                          <>
                                            <Loader2 className="w-2.5 h-2.5 animate-spin text-sky-600" />
                                            <span>Translating...</span>
                                          </>
                                        ) : translatedComments[reply.id] && !showingOriginal[reply.id] ? (
                                          <span>See original</span>
                                        ) : (
                                          <span>See translation</span>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-center shrink-0 pt-0.5 select-none w-7">
                                  <button
                                    type="button"
                                    onClick={() => handleLike(reply.id)}
                                    className="p-1 text-[#737373] hover:text-rose-600 active:scale-75 transition-all cursor-pointer"
                                  >
                                    <Heart
                                      className={`w-3 h-3 transition-colors ${
                                        isReplyLiked
                                          ? 'fill-rose-600 text-rose-600'
                                          : 'text-[#737373] stroke-[1.8]'
                                      }`}
                                    />
                                  </button>
                                  {Boolean(reply.likesCount > 0) && (
                                    <span className="text-[9.5px] font-medium text-[#737373] leading-none mt-0.5">
                                      {reply.likesCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={commentsEndRef} />
        </div>


        {/* 5. Fixed Comment Input Bar */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2.5 shrink-0">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 ring-1 ring-slate-200">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Input field + Replying indicator */}
          <div className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
              placeholder={
                replyingTo 
                  ? `Replying to @${replyingTo.userName}...` 
                  : `Add a comment for ${doctorName || doctorUsername}...`
              }
              className="w-full bg-white text-[13px] text-slate-800 placeholder:text-slate-400 rounded-full py-2 px-4 pr-12 border border-slate-200 focus:outline-none focus:border-sky-500 shadow-2xs font-normal"
            />
            {replyingTo && (
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 text-xs font-bold"
                title="Cancel reply"
              >
                ✕
              </button>
            )}
          </div>

          {/* Send / Post Action Button */}
          <button
            type="button"
            disabled={!commentText.trim() || submitting}
            onClick={handleSendComment}
            className={`h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95 flex items-center justify-center gap-1 ${
              commentText.trim() && !submitting
                ? 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
