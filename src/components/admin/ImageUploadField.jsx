import React, { useState, useRef } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ImageUploadField({
  label,
  value,
  onChange,
  defaultPath = '',
  helpText = 'Recommended formats: JPG, PNG, WEBP, SVG',
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef(null);

  // Process selected file from device
  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, or SVG).');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64Data = e.target.result;

      try {
        // Upload to backend
        const response = await fetch(`${API_BASE_URL}/admin/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Data,
            filename: file.name,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success && result.url) {
          onChange(result.url);
        } else {
          // Fallback to direct base64 data URL if backend disk is unavailable
          onChange(base64Data);
        }
      } catch (err) {
        console.warn('Backend upload notice: saving as base64 data URL directly:', err.message);
        // Fallback to base64 so user is never blocked
        onChange(base64Data);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read image file from your device.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-3">
      {/* Label & Secondary Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-3 text-[11px]">
          {defaultPath && value !== defaultPath && (
            <button
              type="button"
              onClick={() => onChange(defaultPath)}
              className="text-[#ED2024] hover:text-[#d4191d] transition-colors font-bold cursor-pointer"
            >
              Reset to Default Image
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer font-medium"
          >
            {showManualInput ? 'Hide URL' : 'Edit URL / Path'}
          </button>
        </div>
      </div>

      {/* Main Upload Zone & Live Preview Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Upload Trigger Drop Zone (7 cols on desktop) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`md:col-span-7 rounded-[14px] border-2 border-dashed p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
            dragOver
              ? 'border-[#ED2024] bg-[#ED2024]/5 scale-[1.01]'
              : 'border-gray-300 bg-gray-50 hover:border-[#ED2024] hover:bg-red-50/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {uploading ? (
            <div className="py-4 flex flex-col items-center gap-2.5">
              <svg className="animate-spin h-7 w-7 text-[#ED2024]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-[12.5px] font-bold text-gray-900">
                Uploading image from device...
              </span>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#ED2024] group-hover:scale-110 group-hover:bg-[#ED2024]/10 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[13px] font-bold text-gray-900 group-hover:text-[#ED2024] transition-colors">
                  Upload Image from Device
                </span>
                <span className="text-[11.5px] text-gray-500 mt-0.5">
                  Click to browse or drag &amp; drop file from computer
                </span>
              </div>

              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-gray-200/80 text-[10.5px] text-gray-700 font-semibold">
                PNG, JPG, WEBP, or SVG
              </div>
            </div>
          )}
        </div>

        {/* Live Image Preview (5 cols on desktop) */}
        <div className="md:col-span-5 rounded-[14px] bg-gray-50 border border-gray-200 p-3 flex flex-col justify-between overflow-hidden shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
            <span>Live Preview</span>
            <span className="text-emerald-600 font-bold">
              {value?.startsWith('http') ? 'Custom URL' : value?.startsWith('data:') ? 'Device Upload' : 'Default Asset'}
            </span>
          </div>

          <div className="relative w-full h-[120px] rounded-[10px] overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover block"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-[12px] text-gray-400">No image chosen</span>
            )}
          </div>

          <div className="mt-2 text-[11px] text-gray-500 truncate font-mono">
            {value || 'None'}
          </div>
        </div>

      </div>

      {/* Manual Input (revealed by clicking Edit URL / Path) */}
      {showManualInput && (
        <div className="pt-1 animate-fadeIn">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[12.5px] outline-none font-mono shadow-sm"
            placeholder="e.g. /assets/about/hero-bg.jpg or https://..."
          />
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <p className="text-[11.5px] text-[#ED2024] font-medium">{uploadError}</p>
      )}

      {/* Help Note */}
      <p className="text-[11px] text-gray-400">{helpText}</p>
    </div>
  );
}

