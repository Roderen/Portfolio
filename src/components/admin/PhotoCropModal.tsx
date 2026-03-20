"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  file: File;
  onApply: (blob: Blob) => void;
  onCancel: () => void;
}

const CONTAINER = 320; // px — square crop viewport
const OUTPUT = 600;    // px — exported image size
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function PhotoCropModal({ file, onApply, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  // offset = how far the image centre is moved from the container centre (CSS px)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Load file into an object URL
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Reset state when image loads
  const onImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Base scale so image covers the container at zoom=1 (like object-fit: cover)
  const baseScale =
    naturalSize.w && naturalSize.h
      ? Math.max(CONTAINER / naturalSize.w, CONTAINER / naturalSize.h)
      : 1;

  const effectiveScale = baseScale * zoom;

  // Clamp offset so the image always fully covers the container
  function clamp(x: number, y: number) {
    const halfImgW = (naturalSize.w * effectiveScale) / 2;
    const halfImgH = (naturalSize.h * effectiveScale) / 2;
    const half = CONTAINER / 2;
    return {
      x: Math.min(halfImgW - half, Math.max(-(halfImgW - half), x)),
      y: Math.min(halfImgH - half, Math.max(-(halfImgH - half), y)),
    };
  }

  // Pointer drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => clamp(prev.x + dx, prev.y + dy));
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  // Zoom change — re-clamp offset so we stay inside bounds
  function handleZoom(z: number) {
    setZoom(z);
    // Re-clamp with new zoom
    const newEffective = baseScale * z;
    const halfImgW = (naturalSize.w * newEffective) / 2;
    const halfImgH = (naturalSize.h * newEffective) / 2;
    const half = CONTAINER / 2;
    setOffset((prev) => ({
      x: Math.min(halfImgW - half, Math.max(-(halfImgW - half), prev.x)),
      y: Math.min(halfImgH - half, Math.max(-(halfImgH - half), prev.y)),
    }));
  }

  // Export cropped image to canvas → Blob
  function handleApply() {
    const img = imgRef.current;
    if (!img || !naturalSize.w) return;

    const half = CONTAINER / 2;
    // Top-left corner of the crop window in natural image coordinates
    const srcX = naturalSize.w / 2 - (half + offset.x) / effectiveScale;
    const srcY = naturalSize.h / 2 - (half + offset.y) / effectiveScale;
    const srcW = CONTAINER / effectiveScale;
    const srcH = CONTAINER / effectiveScale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT, OUTPUT);

    canvas.toBlob(
      (blob) => {
        if (blob) onApply(blob);
      },
      "image/jpeg",
      0.92
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-5 p-6">
        <h2 className="text-white font-semibold text-lg text-center">Редактировать фото</h2>

        {/* Crop viewport */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden rounded-full cursor-grab active:cursor-grabbing select-none"
            style={{ width: CONTAINER, height: CONTAINER }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerLeave={stopDrag}
          >
            {/* Overlay ring to make the circular boundary clear */}
            <div
              className="absolute inset-0 z-10 rounded-full pointer-events-none"
              style={{ boxShadow: "0 0 0 9999px rgba(17,24,39,0.75)" }}
            />
            {imgSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={imgSrc}
                alt=""
                onLoad={onImageLoad}
                draggable={false}
                style={{
                  position: "absolute",
                  width: naturalSize.w * effectiveScale,
                  height: naturalSize.h * effectiveScale,
                  left: CONTAINER / 2 + offset.x - (naturalSize.w * effectiveScale) / 2,
                  top: CONTAINER / 2 + offset.y - (naturalSize.h * effectiveScale) / 2,
                  userSelect: "none",
                }}
              />
            )}
          </div>
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-1">
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => handleZoom(parseFloat(e.target.value))}
            className="flex-1 h-1.5 appearance-none rounded-full bg-gray-700 accent-indigo-500 cursor-pointer"
          />
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>

        <p className="text-gray-500 text-xs text-center -mt-2">
          Перетащите фото, чтобы выровнять
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}
