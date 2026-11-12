import React, { useState, useRef } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function VideoUploadField({
  label = 'Section Video',
  videoUrl = '',
  posterUrl = '',
  onVideoChange,
  onPosterChange,
  helpText = 'Supports MP4, WEBM, or MOV video files from your device, or YouTube / Vimeo URLs.',
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);
  const posterInputRef = useRef(null);

  // Upload video from device
  const processVideoFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadError('Please select a valid video file (MP4, WEBM, MOV).');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64Data = e.target.result;

      try {
        const response = await fetch(`${API_BASE_URL}/admin/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video: base64Data,
            filename: file.name,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success && result.url) {
          onVideoChange(result.url);
        } else {
          // Fallback to base64 data URL
          onVideoChange(base64Data);
        }
      } catch (err) {
        console.warn('Backend video upload notice: saving data URL:', err.message);
        onVideoChange(base64Data);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read video file from your device.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  // Upload poster image from device
  const processPosterFile = (file) => {
    if (!file || !onPosterChange) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      try {
        const res = await fetch(`${API_BASE_URL}/admin/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, filename: file.name }),
        });
        const result = await res.json();
        if (res.ok && result.success && result.url) {
          onPosterChange(result.url);
        } else {
          onPosterChange(base64Data);
        }
      } catch (_) {
        onPosterChange(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  const isEmbed =
    videoUrl &&
    (videoUrl.includes('youtube.com') ||
      videoUrl.includes('youtu.be') ||
      videoUrl.includes('vimeo.com'));

  return (
    <div className="space-y-4">
      {/* Field Label Header */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#A0A0A0]">
          {label}
        </label>
        <div className="flex items-center gap-3 text-[11px]">
          {videoUrl && (
            <button
              type="button"
              onClick={() => onVideoChange('')}
              className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Remove Video
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            {showUrlInput ? 'Hide Video URL' : 'Paste Video URL / Embed'}
          </button>
        </div>
      </div>

      {/* Main Video Upload & Preview Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Column: Device Video Upload Drop Zone (6 cols) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processVideoFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`md:col-span-6 rounded-[14px] border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
            dragOver
              ? 'border-[#ED2024] bg-[#ED2024]/10 scale-[1.01]'
              : 'border-white/[0.12] bg-[#161616] hover:border-[#ED2024]/60 hover:bg-[#181818]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processVideoFile(file);
            }}
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
            className="hidden"
          />

          {uploading ? (
            <div className="py-6 flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-[#ED2024]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <div className="text-center">
                <span className="text-[13px] font-bold text-white block">
                  Uploading video from your device...
                </span>
                <span className="text-[11px] text-white/50">
                  Saving to server media library
                </span>
              </div>
            </div>
          ) : (
            <div className="py-3 flex flex-col items-center gap-2.5">
              <div className="w-13 h-13 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#ED2024] group-hover:scale-110 group-hover:bg-[#ED2024]/15 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[13.5px] font-bold text-white group-hover:text-[#ED2024] transition-colors">
                  Upload Video from Device
                </span>
                <span className="text-[11.5px] text-[#7E7E7E] mt-0.5">
                  Click to select or drag &amp; drop video from your computer
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-[10.5px] text-white/50 font-medium">
                  MP4, WEBM, MOV
                </span>
                <span className="text-white/30 text-[10px]">&bull;</span>
                <span className="text-[10.5px] text-[#ED2024] font-medium">Up to 150MB</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Video Player Preview (6 cols) */}
        <div className="md:col-span-6 rounded-[14px] bg-[#161616] border border-white/[0.08] p-3 flex flex-col justify-between overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#7E7E7E] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ED2024] animate-pulse" />
              <span>Live Video Player Preview</span>
            </span>
            <span className="text-emerald-400 font-semibold text-[10.5px]">
              {videoUrl ? 'Video Active' : 'Poster Image Only'}
            </span>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-[10px] overflow-hidden bg-black border border-white/[0.06] flex items-center justify-center">
            {videoUrl ? (
              isEmbed ? (
                <iframe
                  src={videoUrl}
                  title="Video Player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  poster={posterUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover block"
                />
              )
            ) : posterUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={posterUrl}
                  alt="Poster"
                  className="w-full h-full object-cover block opacity-85"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="w-11 h-11 rounded-full bg-[#ED2024] text-white flex items-center justify-center pl-0.5 shadow-lg">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-[12px] text-white/30">No video or poster selected</span>
            )}
          </div>

          <div className="mt-2 text-[11px] text-[#8E8E8E] truncate font-mono">
            {videoUrl || posterUrl || 'No media set'}
          </div>
        </div>

      </div>

      {/* Manual Video URL / YouTube Input */}
      {showUrlInput && (
        <div className="p-3.5 rounded-[12px] bg-[#181818] border border-white/[0.08] space-y-2 animate-fadeIn">
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#A0A0A0]">
            Direct Video URL / YouTube / Vimeo Link
          </label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => onVideoChange(e.target.value)}
            className="w-full bg-[#121212] border border-white/[0.08] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-white text-[12.5px] outline-none font-mono"
            placeholder="e.g. https://example.com/video.mp4 or https://www.youtube.com/embed/..."
          />
        </div>
      )}

      {/* Optional Poster / Cover Image for Video */}
      {onPosterChange && (
        <div className="p-3.5 rounded-[12px] bg-[#141414] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/[0.08] overflow-hidden shrink-0 flex items-center justify-center">
              {posterUrl ? (
                <img src={posterUrl} alt="Poster" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11.5px] font-bold text-white uppercase tracking-wider">
                Video Cover / Thumbnail Poster
              </span>
              <span className="text-[11px] text-[#7E7E7E] truncate max-w-[280px]">
                {posterUrl || 'Default Dubai banner'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="file"
              ref={posterInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) processPosterFile(f);
              }}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => posterInputRef.current?.click()}
              className="px-3 py-1.5 rounded-[8px] bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/90 text-[11.5px] font-medium transition-colors cursor-pointer"
            >
              Upload Poster Image
            </button>
            {posterUrl !== '/assets/about/dubai-rlt-banner.jpg' && (
              <button
                type="button"
                onClick={() => onPosterChange('/assets/about/dubai-rlt-banner.jpg')}
                className="text-[11px] text-white/40 hover:text-white/80 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-[11.5px] text-[#ED2024] font-medium">{uploadError}</p>
      )}

      <p className="text-[11px] text-[#6E6E6E]">{helpText}</p>
    </div>
  );
}

