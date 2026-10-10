'use client';

import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  Check, 
  Share2, 
  Download, 
  MessageSquare, 
  Send as SendIcon,
  Bookmark
} from 'lucide-react';
import Image from 'next/image';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  text?: string;
  doctorName?: string;
  doctorPhoto?: string | null;
  doctorSpecialty?: string | null;
  postSnippet?: string | null;
  mediaUrl?: string | null;
  mediaType?: 'IMAGE' | 'VIDEO' | 'NONE' | string | null;
}

export function SocialShareModal({
  isOpen,
  onClose,
  url,
  title,
  text = '',
  doctorName,
  doctorPhoto,
  doctorSpecialty,
  postSnippet,
  mediaUrl,
  mediaType,
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
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

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const shareText = text || title;
  const encodedText = encodeURIComponent(`${shareText}\n\n${url}`);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
        onClose();
      } catch (err) {
        // Cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    if (mediaUrl && mediaType === 'IMAGE') {
      const a = document.createElement('a');
      a.href = mediaUrl;
      a.download = `doctor-post-${Date.now()}.jpg`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      handleCopy();
    }
  };

  // Exact Instagram Share Sheet Action Items with circular branded icons
  const shareActions = [
    {
      id: 'copy',
      name: copied ? 'Copied!' : 'Copy link',
      bg: copied ? 'bg-emerald-600' : 'bg-slate-100 hover:bg-slate-200 border border-slate-200/80',
      icon: copied ? (
        <Check className="w-6 h-6 text-white stroke-[2.5]" />
      ) : (
        <Link2 className="w-6 h-6 text-slate-700 stroke-[2]" />
      ),
      onClick: handleCopy,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      bg: 'bg-[#25D366] hover:bg-[#20ba5a]',
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
      icon: (
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      id: 'messenger',
      name: 'Messenger',
      bg: 'bg-[#0084FF] hover:bg-[#0073e6]',
      href: `fb-messenger://share/?link=${encodedUrl}&app_id=291494419107518`,
      fallbackHref: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`,
      icon: (
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.084.3 2.238.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.888-3.26-6.559 6.963z" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      bg: 'bg-[#1877F2] hover:bg-[#166fe5]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'sms',
      name: 'SMS',
      bg: 'bg-[#1a73e8] hover:bg-[#1557b0]',
      href: `sms:?body=${encodedText}`,
      icon: (
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      ),
    },
    {
      id: 'threads',
      name: 'Threads',
      bg: 'bg-black hover:bg-neutral-800',
      href: `https://www.threads.net/intent/post?text=${encodedText}`,
      icon: (
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M12.186 24C5.454 24 0 18.618 0 12.008 0 5.398 5.454.016 12.186.016c6.685 0 12.075 5.309 12.075 11.992 0 4.167-2.146 7.425-5.599 8.502-.459.143-.935-.11-.98-.588-.046-.477.214-.949.673-1.092 2.87-.898 4.654-3.606 4.654-7.054 0-5.69-4.582-10.208-10.223-10.208-5.64 0-10.222 4.518-10.222 10.208 0 5.69 4.582 10.208 10.222 10.208 3.013 0 5.867-1.34 7.633-3.585.318-.403.906-.464 1.309-.147.403.318.464.906.147 1.309-2.115 2.689-5.534 4.296-9.143 4.296zm4.821-12.784c-.218-3.037-2.316-4.992-4.997-4.992-3.13 0-5.26 2.383-5.26 5.877 0 3.327 2.012 5.753 5.093 5.753 1.944 0 3.682-.99 4.636-2.641.238-.413.766-.554 1.179-.316.413.238.554.766.316 1.179-1.228 2.126-3.468 3.398-6.031 3.398-4.043 0-6.732-3.144-6.732-7.373 0-4.398 2.766-7.497 6.859-7.497 3.551 0 6.377 2.593 6.643 6.444.029.418-.285.783-.703.812-.418.029-.783-.285-.812-.703z" />
        </svg>
      ),
    },
    {
      id: 'x',
      name: 'X',
      bg: 'bg-black hover:bg-neutral-800',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'share',
      name: 'Share',
      bg: 'bg-slate-100 hover:bg-slate-200 border border-slate-200/80',
      icon: <Share2 className="w-6 h-6 text-slate-700 stroke-[2]" />,
      onClick: handleNativeShare,
    },
    {
      id: 'download',
      name: 'Download',
      bg: 'bg-slate-100 hover:bg-slate-200 border border-slate-200/80',
      icon: <Download className="w-6 h-6 text-slate-700 stroke-[2]" />,
      onClick: handleDownload,
    },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden ${
        isClosing ? 'animate-backdrop-fade-out pointer-events-none' : 'animate-backdrop-fade'
      }`}
      onClick={handleRequestClose}
    >
      {/* Instagram Native Light Theme Bottom Sheet Drawer */}
      <div 
        className={`relative w-full max-w-lg bg-white text-slate-900 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden border-t sm:border border-slate-200/80 font-sans ${
          isClosing ? 'animate-sheet-down pointer-events-none' : 'animate-sheet-up'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Pill Bar */}
        <div className="pt-3 pb-2 flex justify-center">
          <div 
            onClick={handleRequestClose}
            className="w-10 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors cursor-pointer" 
          />
        </div>

        {/* Post Preview Snippet */}
        {(doctorName || postSnippet) && (
          <div className="mx-5 my-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
            {doctorPhoto && (
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative bg-slate-100">
                <Image
                  src={doctorPhoto}
                  alt={doctorName || 'Doctor'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[13px] text-slate-900 truncate">
                {doctorName}
              </h4>
              {postSnippet && (
                <p className="text-[11.5px] text-slate-500 line-clamp-1 leading-snug mt-0.5">
                  {postSnippet}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Horizontal Scrolling Action Icons Row (Scrollbar completely hidden across all browsers) */}
        <div className="px-5 pt-2 pb-6">
          <div className="flex items-start gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 -mx-2 px-2 select-none">
            {shareActions.map((action) => {
              const content = (
                <div className="flex flex-col items-center group cursor-pointer shrink-0">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm ${action.bg}`}
                  >
                    {action.icon}
                  </div>
                  <span className="text-[11.5px] text-slate-600 font-medium text-center leading-tight max-w-[68px] truncate mt-2 group-hover:text-slate-900">
                    {action.name}
                  </span>
                </div>
              );

              if (action.href) {
                return (
                  <a
                    key={action.id}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setTimeout(() => onClose(), 500);
                    }}
                    className="shrink-0 no-underline"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={action.onClick}
                  className="shrink-0 bg-transparent border-0 p-0"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* Copy confirmation banner */}
        {copied && (
          <div className="bg-emerald-600/90 text-white text-xs font-semibold py-2 px-4 text-center animate-in fade-in duration-150">
            ✓ Link copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
}
