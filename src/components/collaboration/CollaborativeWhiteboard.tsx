/**
 * Collaborative whiteboard component for real-time drawing during interviews
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface DrawingEvent {
  type: 'draw' | 'clear' | 'undo';
  data: any;
  timestamp: number;
  userId: string;
}

interface CollaborativeWhiteboardProps {
  roomId: string;
  userId: string;
  onDrawingEvent?: (event: DrawingEvent) => void;
  onReceiveDrawingEvent?: (event: DrawingEvent) => void;
  readOnly?: boolean;
  width?: number;
  height?: number;
}

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  roomId,
  userId,
  onDrawingEvent,
  onReceiveDrawingEvent,
  readOnly = false,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [drawingHistory, setDrawingHistory] = useState<DrawingEvent[]>([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  // Update canvas styles when tool changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : strokeColor;
    ctx.lineWidth = currentTool === 'eraser' ? strokeWidth * 3 : strokeWidth;
  }, [currentTool, strokeColor, strokeWidth]);

  // Handle incoming drawing events from other users
  useEffect(() => {
    if (!onReceiveDrawingEvent) return;

    const handleDrawingEvent = (event: DrawingEvent) => {
      if (event.userId === userId) return; // Don't apply our own events

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      switch (event.type) {
        case 'draw':
          applyDrawingData(ctx, event.data);
          break;
        case 'clear':
          clearCanvas(ctx);
          break;
        case 'undo':
          redrawFromHistory(ctx, event.data.history);
          break;
      }
    };

    // This would be connected to WebSocket or other real-time service
    // For now, we'll just set up the handler
    onReceiveDrawingEvent(handleDrawingEvent as any);
  }, [onReceiveDrawingEvent, userId]);

  const applyDrawingData = (ctx: CanvasRenderingContext2D, data: any) => {
    const { path, color, width, tool } = data;
    
    ctx.save();
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? width * 3 : width;
    
    ctx.beginPath();
    path.forEach((point: { x: number; y: number }, index: number) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.restore();
  };

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  };

  const redrawFromHistory = (ctx: CanvasRenderingContext2D, history: DrawingEvent[]) => {
    clearCanvas(ctx);
    history.forEach(event => {
      if (event.type === 'draw') {
        applyDrawingData(ctx, event.data);
      }
    });
  };

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [readOnly]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, readOnly]);

  const stopDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;

    setIsDrawing(false);

    // Capture the drawing path for collaboration
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // Create drawing event
    const drawingEvent: DrawingEvent = {
      type: 'draw',
      data: {
        path: [{ x: endX, y: endY }], // In a real implementation, you'd capture the full path
        color: strokeColor,
        width: strokeWidth,
        tool: currentTool
      },
      timestamp: Date.now(),
      userId
    };

    setDrawingHistory(prev => [...prev, drawingEvent]);
    onDrawingEvent?.(drawingEvent);
  }, [isDrawing, readOnly, strokeColor, strokeWidth, currentTool, userId, onDrawingEvent]);

  const handleClear = () => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx);

    const clearEvent: DrawingEvent = {
      type: 'clear',
      data: {},
      timestamp: Date.now(),
      userId
    };

    setDrawingHistory([]);
    onDrawingEvent?.(clearEvent);
  };

  const handleUndo = () => {
    if (readOnly || drawingHistory.length === 0) return;

    const newHistory = drawingHistory.slice(0, -1);
    setDrawingHistory(newHistory);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    redrawFromHistory(ctx, newHistory);

    const undoEvent: DrawingEvent = {
      type: 'undo',
      data: { history: newHistory },
      timestamp: Date.now(),
      userId
    };

    onDrawingEvent?.(undoEvent);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `whiteboard-${roomId}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={currentTool === 'pen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('pen')}
              disabled={readOnly}
            >
              ✏️ Pen
            </Button>
            <Button
              variant={currentTool === 'eraser' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('eraser')}
              disabled={readOnly}
            >
              🧹 Eraser
            </Button>
            
            <div className="flex items-center space-x-1">
              <label htmlFor="color-picker" className="text-sm">Color:</label>
              <input
                id="color-picker"
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                disabled={readOnly}
                className="w-8 h-8 rounded border"
              />
            </div>
            
            <div className="flex items-center space-x-1">
              <label htmlFor="stroke-width" className="text-sm">Size:</label>
              <input
                id="stroke-width"
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                disabled={readOnly}
                className="w-20"
              />
              <span className="text-sm w-6">{strokeWidth}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={readOnly || drawingHistory.length === 0}
            >
              ↶ Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={readOnly}
            >
              🗑️ Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
            >
              💾 Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`block ${readOnly ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {readOnly && (
          <div className="text-center text-sm text-gray-500">
            View-only mode - You cannot draw on this whiteboard
          </div>
        )}
      </div>
    </Card>
  );
};

export default CollaborativeWhiteboard;