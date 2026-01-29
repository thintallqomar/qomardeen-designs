import { useEffect, useCallback, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ImageViewerProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

const ImageViewer = ({ images, currentIndex, isOpen, onClose, onNavigate }: ImageViewerProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialPinchZoom, setInitialPinchZoom] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance for navigation (in px)
  const minSwipeDistance = 50;

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
      setIsLoading(true);
      resetZoom();
    }
  }, [currentIndex, onNavigate, resetZoom]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
      setIsLoading(true);
      resetZoom();
    }
  }, [currentIndex, images.length, onNavigate, resetZoom]);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(MIN_ZOOM, prev - ZOOM_STEP);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (zoom > 1) {
            resetZoom();
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          if (zoom === 1) goToPrevious();
          break;
        case 'ArrowRight':
          if (zoom === 1) goToNext();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext, zoom, zoomIn, zoomOut, resetZoom]);

  // Lock body scroll when viewer is open
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

  // Reset zoom when image changes
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen) return;

    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    if (currentIndex > 0) {
      preloadImage(images[currentIndex - 1].src);
    }

    if (currentIndex < images.length - 1) {
      preloadImage(images[currentIndex + 1].src);
    }
  }, [isOpen, currentIndex, images]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  // Get distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Touch handlers for swipe and pinch zoom
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      setInitialPinchDistance(getTouchDistance(e.touches));
      setInitialPinchZoom(zoom);
    } else if (e.touches.length === 1) {
      if (zoom > 1) {
        // Start panning
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      } else {
        // Swipe navigation
        setTouchEnd(null);
        setTouchStart(e.touches[0].clientX);
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      // Pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, initialPinchZoom * scale));
      setZoom(newZoom);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1) {
      if (isDragging && zoom > 1) {
        // Panning
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      } else if (zoom === 1) {
        // Swipe
        setTouchEnd(e.touches[0].clientX);
      }
    }
  };

  const onTouchEnd = () => {
    setInitialPinchDistance(null);
    setIsDragging(false);

    if (zoom === 1 && touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        goToNext();
      } else if (isRightSwipe) {
        goToPrevious();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse drag for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click to toggle zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoom > 1) {
      resetZoom();
    } else {
      setZoom(2);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current && zoom === 1) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;
  const isZoomed = zoom > 1;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={handleBackdropClick}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Top controls bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        {/* Image counter */}
        <div className="text-white/70 text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
            <button
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-white/70 text-xs font-medium min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
            {isZoomed && (
              <button
                onClick={resetZoom}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors ml-1"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close viewer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Previous button */}
      {hasPrevious && !isZoomed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Next button */}
      {hasNext && !isZoomed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Image container */}
      <div
        ref={imageContainerRef}
        className={`w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12 ${
          isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-full w-auto h-auto object-contain select-none transition-transform duration-150 ease-out"
          style={{
            imageRendering: 'auto',
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          }}
          onLoad={() => setIsLoading(false)}
          draggable={false}
        />
      </div>

      {/* Zoom hint */}
      {!isZoomed && !isLoading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
          Double-click or scroll to zoom • Use +/- keys
        </div>
      )}
    </div>,
    document.body
  );
};

export default ImageViewer;
