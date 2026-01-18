import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Paintbrush, Eraser, RotateCcw, ScanLine } from "lucide-react";
import { WallArtSize, WALL_ART_SIZES, REFERENCE_WALL_WIDTH_CM } from "@/config/wallSizes";

interface WallPreviewProps {
  wallImage: string | null;
  paintingImage: string;
  hasFrame: boolean;
  size: WallArtSize;
}

export const WallPreview = ({ wallImage, paintingImage, hasFrame, size }: WallPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wallCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [lightingTint, setLightingTint] = useState({ brightness: 1, temperature: 0 });
  const [isOcclusionMode, setIsOcclusionMode] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isPainting, setIsPainting] = useState(false);

  // Perspective controls
  const [wallAngle, setWallAngle] = useState(0); // -30 to 30 degrees
  const [verticalTilt, setVerticalTilt] = useState(0); // -15 to 15 degrees
  const [detectedAngle, setDetectedAngle] = useState<number | null>(null);

  // Detect wall angle using edge detection
  const detectWallAngle = useCallback(() => {
    if (!wallImage || !wallCanvasRef.current) return;

    const canvas = wallCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Use smaller size for faster processing
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple edge detection using Sobel operator
      const edges: { x: number; y: number; strength: number }[] = [];

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4;

          // Get grayscale values
          const getGray = (i: number) => (data[i] + data[i + 1] + data[i + 2]) / 3;

          const tl = getGray(((y - 1) * canvas.width + (x - 1)) * 4);
          const t = getGray(((y - 1) * canvas.width + x) * 4);
          const tr = getGray(((y - 1) * canvas.width + (x + 1)) * 4);
          const l = getGray((y * canvas.width + (x - 1)) * 4);
          const r = getGray((y * canvas.width + (x + 1)) * 4);
          const bl = getGray(((y + 1) * canvas.width + (x - 1)) * 4);
          const b = getGray(((y + 1) * canvas.width + x) * 4);
          const br = getGray(((y + 1) * canvas.width + (x + 1)) * 4);

          // Sobel gradients
          const gx = -tl - 2 * l - bl + tr + 2 * r + br;
          const gy = -tl - 2 * t - tr + bl + 2 * b + br;
          const strength = Math.sqrt(gx * gx + gy * gy);

          if (strength > 50) {
            const angle = Math.atan2(gy, gx) * (180 / Math.PI);
            edges.push({ x, y, strength });
          }
        }
      }

      // Find dominant vertical lines (wall edges)
      // Look for strong vertical edges and estimate perspective
      const centerX = canvas.width / 2;
      let leftEdges = 0, rightEdges = 0;

      edges.forEach(edge => {
        if (edge.x < centerX) leftEdges++;
        else rightEdges++;
      });

      // Estimate angle based on edge distribution
      const edgeRatio = (rightEdges - leftEdges) / (rightEdges + leftEdges + 1);
      const estimated = edgeRatio * 15; // Scale to reasonable angle

      setDetectedAngle(Math.round(estimated));
    };
    img.src = wallImage;
  }, [wallImage]);

  // Sample wall lighting near painting position
  const sampleWallLighting = useCallback(() => {
    if (!wallImage || !wallCanvasRef.current) return;

    const canvas = wallCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample pixels around the painting position
      const sampleX = Math.floor((position.x / 100) * img.width);
      const sampleY = Math.floor((position.y / 100) * img.height);
      const sampleRadius = 50;

      let totalR = 0, totalG = 0, totalB = 0, count = 0;

      for (let dx = -sampleRadius; dx <= sampleRadius; dx += 10) {
        for (let dy = -sampleRadius; dy <= sampleRadius; dy += 10) {
          const x = Math.max(0, Math.min(img.width - 1, sampleX + dx));
          const y = Math.max(0, Math.min(img.height - 1, sampleY + dy));
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          totalR += pixel[0];
          totalG += pixel[1];
          totalB += pixel[2];
          count++;
        }
      }

      const avgR = totalR / count;
      const avgG = totalG / count;
      const avgB = totalB / count;

      // Calculate brightness (more subtle: 0.85-1.1 range)
      const brightness = 0.85 + (((avgR + avgG + avgB) / 3) / 255) * 0.25;

      // Calculate temperature (very subtle: -0.15 to 0.15)
      const temperature = ((avgR - avgB) / 255) * 0.15;

      setLightingTint({ brightness, temperature });
    };
    img.src = wallImage;
  }, [wallImage, position]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, [wallImage]);

  useEffect(() => {
    sampleWallLighting();
    detectWallAngle();
  }, [sampleWallLighting, detectWallAngle]);

  // Initialize mask canvas
  useEffect(() => {
    if (maskCanvasRef.current && containerSize.width > 0) {
      const canvas = maskCanvasRef.current;
      canvas.width = containerSize.width;
      canvas.height = containerSize.height;
    }
  }, [containerSize]);

  const applyDetectedAngle = () => {
    if (detectedAngle !== null) {
      setWallAngle(detectedAngle);
    }
  };

  const getPositionFromEvent = (clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOcclusionMode) {
      setIsPainting(true);
      paintMask(e);
      return;
    }
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOcclusionMode) {
      setIsPainting(true);
      const touch = e.touches[0];
      paintMaskAt(touch.clientX, touch.clientY);
      return;
    }
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isOcclusionMode && isPainting) {
      paintMask(e);
      return;
    }

    if (!isDragging) return;

    const pos = getPositionFromEvent(e.clientX, e.clientY);
    if (pos) setPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isOcclusionMode && isPainting) {
      const touch = e.touches[0];
      paintMaskAt(touch.clientX, touch.clientY);
      return;
    }

    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const pos = getPositionFromEvent(touch.clientX, touch.clientY);
    if (pos) setPosition(pos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPainting(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPainting(false);
  };

  const paintMaskAt = (clientX: number, clientY: number) => {
    if (!maskCanvasRef.current || !containerRef.current || !wallImage) return;

    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fill();

    updateOverlay();
  };

  const paintMask = (e: React.MouseEvent) => {
    paintMaskAt(e.clientX, e.clientY);
  };

  // Draw wall image onto mask canvas where painted
  const [wallImageObj, setWallImageObj] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (wallImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setWallImageObj(img);
      img.src = wallImage;
    }
  }, [wallImage]);

  const updateOverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !maskCanvasRef.current || !wallImageObj) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = containerSize.width;
    canvas.height = containerSize.height;

    // Clear and draw wall image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(wallImageObj, 0, 0, containerSize.width, containerSize.height);

    // Use mask as clip - only show wall where mask is painted
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskCanvasRef.current, 0, 0);
  }, [wallImageObj, containerSize]);

  useEffect(() => {
    updateOverlay();
  }, [updateOverlay]);

  const clearMask = () => {
    if (!maskCanvasRef.current) return;
    const ctx = maskCanvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
    }
    updateOverlay();
  };

  // Calculate painting dimensions based on cm sizes and reference wall width
  const wallWidthInPixels = containerSize.width;
  const pixelsPerCm = wallWidthInPixels / REFERENCE_WALL_WIDTH_CM;

  const currentSizeConfig = WALL_ART_SIZES[size];
  const paintingWidth = currentSizeConfig.width * pixelsPerCm;
  const paintingHeight = currentSizeConfig.height * pixelsPerCm;

  // Calculate shadow offset based on painting position
  const shadowOffsetX = (position.x - 50) * 0.1 + wallAngle * 0.5;
  const shadowOffsetY = Math.max(5, (position.y - 30) * 0.15);

  // Subtle lighting filter
  const lightingFilter = `
    brightness(${lightingTint.brightness})
    ${Math.abs(lightingTint.temperature) > 0.05 ? `sepia(${Math.abs(lightingTint.temperature) * 0.2})` : ''}
    ${lightingTint.temperature > 0.05 ? 'hue-rotate(-5deg)' : lightingTint.temperature < -0.05 ? 'hue-rotate(5deg)' : ''}
  `.trim();

  // Calculate perspective transform based on wall angle
  const perspectiveTransform = `
    perspective(1000px)
    rotateY(${wallAngle}deg)
    rotateX(${verticalTilt}deg)
  `;

  // Calculate which sides are visible based on angle
  const showLeftEdge = wallAngle > 3;
  const showRightEdge = wallAngle < -3;
  const showTopEdge = verticalTilt < -3;
  const showBottomEdge = verticalTilt > 3;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={isOcclusionMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setIsOcclusionMode(!isOcclusionMode);
            setIsErasing(false);
          }}
        >
          <Paintbrush className="w-4 h-4 mr-1" />
          Mask
        </Button>
        {isOcclusionMode && (
          <>
            <Button
              variant={isErasing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsErasing(!isErasing)}
            >
              <Eraser className="w-4 h-4 mr-1" />
              Eraser
            </Button>
            <Button variant="outline" size="sm" onClick={clearMask}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </>
        )}
        {detectedAngle !== null && (
          <Button variant="outline" size="sm" onClick={applyDetectedAngle}>
            <ScanLine className="w-4 h-4 mr-1" />
            Auto-detect ({detectedAngle}°)
          </Button>
        )}
      </div>

      {/* Angle Controls */}
      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Wall Angle: {wallAngle}°</label>
          <Slider
            value={[wallAngle]}
            onValueChange={([v]) => setWallAngle(v)}
            min={-30}
            max={30}
            step={1}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Vertical Tilt: {verticalTilt}°</label>
          <Slider
            value={[verticalTilt]}
            onValueChange={([v]) => setVerticalTilt(v)}
            min={-15}
            max={15}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] bg-muted overflow-hidden touch-none"
        style={{ cursor: isOcclusionMode ? 'crosshair' : 'default' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Hidden canvas for sampling wall colors */}
        <canvas ref={wallCanvasRef} className="hidden" />

        {wallImage ? (
          <img
            src={wallImage}
            alt="Your wall"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-accent">
            <p className="text-muted-foreground text-center px-8">
              Upload a photo of your wall to see the preview
            </p>
          </div>
        )}

        {/* Painting with realistic compositing */}
        <div
          className="absolute transition-all duration-100"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            width: paintingWidth,
            height: paintingHeight,
            transform: `translate(-50%, -50%) ${perspectiveTransform}`,
            cursor: isOcclusionMode ? 'crosshair' : (isDragging ? "grabbing" : "grab"),
            zIndex: 10,
            transformStyle: 'preserve-3d',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Shadow layer */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              transform: `translateZ(-10px) translate(${shadowOffsetX}px, ${shadowOffsetY}px)`,
              background: 'rgba(0,0,0,0.35)',
              filter: 'blur(10px)',
              opacity: 0.5,
            }}
          />

          {/* Side edges for 3D effect */}
          {showLeftEdge && (
            <div
              className="absolute top-0 bottom-0 bg-card/80"
              style={{
                left: 0,
                width: Math.abs(wallAngle) * 0.3,
                transform: 'translateX(-100%) rotateY(90deg)',
                transformOrigin: 'right center',
              }}
            />
          )}
          {showRightEdge && (
            <div
              className="absolute top-0 bottom-0 bg-card/60"
              style={{
                right: 0,
                width: Math.abs(wallAngle) * 0.3,
                transform: 'translateX(100%) rotateY(-90deg)',
                transformOrigin: 'left center',
              }}
            />
          )}

          {/* Main painting with frame */}
          <div
            className={`w-full h-full relative ${hasFrame ? "p-2 bg-card" : ""}`}
            style={{
              filter: lightingFilter,
              // Feathered edge effect
              maskImage: 'linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%)',
              WebkitMaskComposite: 'source-in',
            }}
          >
            {hasFrame && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  border: '8px solid',
                  borderColor: 'hsl(var(--primary) / 0.8)',
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.25)',
                }}
              />
            )}
            <img
              src={paintingImage}
              alt="Selected painting"
              className="w-full h-full object-cover"
              draggable={false}
              style={{
                boxShadow: hasFrame ? 'inset 0 0 15px rgba(0,0,0,0.15)' : 'none',
              }}
            />
          </div>
        </div>

        {/* Hidden mask canvas for tracking painted areas */}
        <canvas
          ref={maskCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 5,
            opacity: 0,
          }}
        />

        {/* Overlay canvas - shows wall image where mask is painted */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 20 }}
        />

        {/* Invisible painting area for occlusion mask interaction */}
        {isOcclusionMode && (
          <div
            className="absolute inset-0"
            style={{ zIndex: 15 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          />
        )}

        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1.5 text-xs text-card-foreground z-30">
          {isOcclusionMode ? "Paint to mask furniture" : "Drag to reposition"}
        </div>
      </div>
    </div>
  );
};
