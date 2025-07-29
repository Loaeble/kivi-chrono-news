import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock, Image } from 'lucide-react';
import { useController } from './Controller';

interface UIProps {
  className?: string;
}

export const UI = ({ className }: UIProps) => {
  const { state, controller } = useController();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer functionality
  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      setIsTimerActive(true);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setIsTimerActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isRunning, state.isPaused]);

  // Reset timer when stopping
  useEffect(() => {
    if (!state.isRunning) {
      setElapsedTime(0);
    }
  }, [state.isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (state.isPaused) {
      controller.resume();
    } else {
      controller.start();
    }
  };

  const handlePause = () => {
    controller.pause();
  };

  const handleExit = () => {
    controller.stop();
  };

  return (
    <div className={`min-h-screen bg-background p-4 ${className}`}>
      <div className="max-w-md mx-auto space-y-4">
        {/* Header with Timer and Counter */}
        <Card className="shadow-elegant">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg font-semibold">
              News Scraper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timer and Counter Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Timer</span>
                </div>
                <div className="text-2xl font-mono font-bold text-primary">
                  {formatTime(elapsedTime)}
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Images</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {state.imageCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Display */}
        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Status
              <Badge 
                variant={state.isRunning ? (state.isPaused ? "warning" : "success") : "secondary"}
                className="ml-2"
              >
                {state.isRunning ? (state.isPaused ? "Paused" : "Running") : "Stopped"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {state.statusMessage}
            </p>
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Activity Log</h4>
              <ScrollArea className="h-32 w-full rounded border bg-muted/30 p-2">
                <div className="space-y-1">
                  {state.logs.slice(-10).reverse().map((log, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <Card className="shadow-elegant">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="success"
                size="lg"
                onClick={handleStart}
                disabled={state.isRunning && !state.isPaused}
                className="flex-col h-16 gap-1"
              >
                <Play className="h-5 w-5" />
                <span className="text-xs">
                  {state.isPaused ? "Resume" : "Start"}
                </span>
              </Button>
              
              <Button
                variant="warning"
                size="lg"
                onClick={handlePause}
                disabled={!state.isRunning || state.isPaused}
                className="flex-col h-16 gap-1"
              >
                <Pause className="h-5 w-5" />
                <span className="text-xs">Pause</span>
              </Button>
              
              <Button
                variant="info"
                size="lg"
                onClick={handleExit}
                className="flex-col h-16 gap-1"
              >
                <Square className="h-5 w-5" />
                <span className="text-xs">Stop</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};