import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/button';

interface WhiteboardCanvasProps {
  width?: number;
  height?: number;
  onCanvasChange?: (canvasData: string) => void;
  readOnly?: boolean;
  initialData?: string;
}

interface Point {
  x: number;
  y: number;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasChange,
  readOnly = false,
  initialData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [brushSize, setBrushSize] = useState(2);
  const [color, setColor] = useState('#000000');
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const getTouchPos = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }, []);

  const drawLine = useCallback((from: Point, to: Point) => {
    const ctx = getContext();
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    
    if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [getContext, currentTool, color, brushSize]);

  const startDrawing = useCallback((point: Point) => {
    if (readOnly) return;
    setIsDrawing(true);
    setLastPoint(point);
  }, [readOnly]);

  const draw = useCallback((point: Point) => {
    if (!isDrawing || !lastPoint || readOnly) return;
    
    drawLine(lastPoint, point);
    setLastPoint(point);
    
    // Notify parent of canvas change
    if (onCanvasChange) {
      const canvas = canvasRef.current;
      if (canvas) {
        onCanvasChange(canvas.toDataURL());
      }
    }
  }, [isDrawing, lastPoint, readOnly, drawLine, onCanvasChange]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);
    startDrawing(point);
  }, [getMousePos, startDrawing]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);
    draw(point);
  }, [getMousePos, draw]);

  const handleMouseUp = useCallback(() => {
    stopDrawing();
  }, [stopDrawing]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getTouchPos(e);
    startDrawing(point);
  }, [getTouchPos, startDrawing]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getTouchPos(e);
    draw(point);
  }, [getTouchPos, draw]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  }, [stopDrawing]);

  const clearCanvas = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    if (onCanvasChange) {
      const canvas = canvasRef.current;
      if (canvas) {
        onCanvasChange(canvas.toDataURL());
      }
    }
  }, [getContext, width, height, onCanvasChange]);

  const loadCanvasData = useCallback((dataUrl: string) => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  }, [getContext, width, height]);

  // Initialize canvas
  useEffect(() => {
    const ctx = getContext();
    if (!ctx) return;

    // Set canvas background to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Load initial data if provided
    if (initialData) {
      loadCanvasData(initialData);
    }
  }, [getContext, width, height, initialData, loadCanvasData]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex space-x-2">
            <Button
              variant={currentTool === 'pen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('pen')}
            >
              Pen
            </Button>
            <Button
              variant={currentTool === 'eraser' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('eraser')}
            >
              Eraser
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm w-8">{brushSize}</span>
          </div>

          {currentTool === 'pen' && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Canvas */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`block ${readOnly ? 'cursor-default' : 'cursor-crosshair'}`}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
};

export default WhiteboardCanvas;