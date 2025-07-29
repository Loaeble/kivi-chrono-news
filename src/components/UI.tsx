import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock, Image, Sparkles, Loader2, Search } from 'lucide-react';
import { useController } from './Controller';
import { ThemeToggle } from './ThemeToggle';
import { useDelightfulToast } from './DelightfulToast';

interface UIProps {
  className?: string;
}

export const UI = ({ className }: UIProps) => {
  const { state, controller } = useController();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast, ToastContainer } = useDelightfulToast();

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

  // Toast notifications for state changes
  useEffect(() => {
    if (state.isRunning && !state.isPaused && elapsedTime === 0) {
      showToast('Scraping started! 🚀', 'success', '🎉');
    }
  }, [state.isRunning, state.isPaused, elapsedTime]);

  useEffect(() => {
    if (state.isPaused) {
      showToast('Scraping paused ⏸️', 'warning', '⏳');
    }
  }, [state.isPaused]);

  useEffect(() => {
    if (!state.isRunning && elapsedTime > 0) {
      showToast('Scraping completed! ✨', 'info', '🎊');
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
    <>
      <div className={`min-h-screen bg-gradient-subtle p-4 transition-all duration-500 ${className}`}>
        <div className="max-w-md mx-auto space-y-6">
          {/* Header with Theme Toggle */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary animate-pulse-glow" />
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                News Scraper
              </h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Timer and Counter Card */}
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-md overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-teal-purple opacity-5"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className="text-center text-lg font-semibold flex items-center justify-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Live Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center space-y-3 group">
                  <div className="flex items-center justify-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Clock className="h-4 w-4 text-teal" />
                    <span className="text-sm font-medium text-muted-foreground">Timer</span>
                  </div>
                  <div className={`text-3xl font-mono font-bold transition-all duration-300 ${
                    isTimerActive ? 'text-teal animate-pulse-glow' : 'text-primary'
                  }`}>
                    {formatTime(elapsedTime)}
                  </div>
                  {isTimerActive && (
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-teal-purple animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                <div className="text-center space-y-3 group">
                  <div className="flex items-center justify-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Image className="h-4 w-4 text-purple" />
                    <span className="text-sm font-medium text-muted-foreground">Images</span>
                  </div>
                  <div className="text-3xl font-bold text-purple transition-all duration-300 group-hover:scale-110">
                    {state.imageCount}
                  </div>
                  {state.imageCount > 0 && (
                    <div className="text-xs text-muted-foreground animate-bounce-gentle">
                      +{state.imageCount} created ✨
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Display Card */}
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-md overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-sunset opacity-5"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {state.isRunning && !state.isPaused ? (
                    <Loader2 className="h-4 w-4 animate-spin-slow text-success" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  )}
                  Status
                </span>
                <Badge 
                  variant={state.isRunning ? (state.isPaused ? "warning" : "success") : "secondary"}
                  className="animate-scale-in"
                >
                  {state.isRunning ? (state.isPaused ? "⏸️ Paused" : "🔄 Running") : "⏹️ Stopped"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                {state.statusMessage}
              </p>
              
              <Separator className="my-4 bg-gradient-to-r from-transparent via-border to-transparent" />
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
                  Activity Log
                </h4>
                <ScrollArea className="h-32 w-full rounded-xl border bg-muted/30 p-3 backdrop-blur-sm">
                  <div className="space-y-2">
                    {state.logs.slice(-10).reverse().map((log, index) => (
                      <div 
                        key={index} 
                        className="text-xs text-muted-foreground p-2 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Control Buttons Card */}
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-md overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardContent className="pt-6 relative">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleStart}
                  disabled={state.isRunning && !state.isPaused}
                  className="flex-col h-20 gap-2 group transition-all duration-300"
                >
                  <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">
                    {state.isPaused ? "Resume" : "Start"}
                  </span>
                </Button>
                
                <Button
                  variant="warning"
                  size="lg"
                  onClick={handlePause}
                  disabled={!state.isRunning || state.isPaused}
                  className="flex-col h-20 gap-2 group transition-all duration-300"
                >
                  <Pause className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Pause</span>
                </Button>
                
                <Button
                  variant="info"
                  size="lg"
                  onClick={handleExit}
                  className="flex-col h-20 gap-2 group transition-all duration-300"
                >
                  <Square className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Stop</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Decorative Footer */}
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground opacity-60">
              Built with ✨ delightful design
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};