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
      <div className={`min-h-screen bg-gradient-hero p-6 transition-all duration-500 ${className}`}>
        <div className="max-w-md mx-auto space-y-8">
          {/* Header with Theme Toggle */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-white drop-shadow-lg animate-pulse-glow" />
                <div className="absolute inset-0 h-8 w-8 bg-white/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg font-sans tracking-tight">
                News Scraper
              </h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Timer and Counter Card */}
          <Card className="bg-white/95 dark:bg-card/95 border-0 shadow-xl backdrop-blur-xl overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardHeader className="pb-6 relative">
              <CardTitle className="text-center text-xl font-bold flex items-center justify-center gap-3 text-foreground">
                <div className="relative">
                  <Search className="h-6 w-6 text-primary" />
                  <div className="absolute inset-0 h-6 w-6 bg-primary/20 rounded-full blur animate-pulse"></div>
                </div>
                Live Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center space-y-4 group">
                  <div className="flex items-center justify-center space-x-2 opacity-80 group-hover:opacity-100 transition-all duration-300">
                    <Clock className="h-5 w-5 text-teal" />
                    <span className="text-sm font-semibold text-muted-foreground tracking-wide">Timer</span>
                  </div>
                  <div className={`text-4xl font-mono font-bold transition-all duration-500 ${
                    isTimerActive ? 'text-teal animate-pulse-glow scale-105' : 'text-primary'
                  }`}>
                    {formatTime(elapsedTime)}
                  </div>
                  {isTimerActive && (
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-teal-purple animate-shimmer relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-center space-y-4 group">
                  <div className="flex items-center justify-center space-x-2 opacity-80 group-hover:opacity-100 transition-all duration-300">
                    <Image className="h-5 w-5 text-purple" />
                    <span className="text-sm font-semibold text-muted-foreground tracking-wide">Images</span>
                  </div>
                  <div className="text-4xl font-bold text-purple transition-all duration-500 group-hover:scale-110">
                    {state.imageCount}
                  </div>
                  {state.imageCount > 0 && (
                    <div className="text-sm font-medium text-purple/80 animate-bounce-gentle">
                      +{state.imageCount} created ✨
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Display Card */}
          <Card className="bg-white/95 dark:bg-card/95 border-0 shadow-xl backdrop-blur-xl overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-sunset opacity-5"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className="text-lg font-bold flex items-center justify-between text-foreground">
                <span className="flex items-center gap-3">
                  {state.isRunning && !state.isPaused ? (
                    <Loader2 className="h-5 w-5 animate-spin-slow text-success" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  )}
                  Status
                </span>
                <Badge 
                  variant={state.isRunning ? (state.isPaused ? "warning" : "success") : "secondary"}
                  className="animate-scale-in text-sm px-3 py-1"
                >
                  {state.isRunning ? (state.isPaused ? "⏸️ Paused" : "🔄 Running") : "⏹️ Stopped"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-base text-foreground mb-6 font-medium">
                {state.statusMessage}
              </p>
              
              <Separator className="my-6 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
              
              <div className="space-y-4">
                <h4 className="text-base font-bold flex items-center gap-3 text-foreground">
                  <div className="w-3 h-3 bg-gradient-primary rounded-full animate-pulse shadow-glow"></div>
                  Activity Log
                </h4>
                <ScrollArea className="h-40 w-full rounded-2xl border bg-muted/20 p-4 backdrop-blur-sm">
                  <div className="space-y-3">
                    {state.logs.slice(-10).reverse().map((log, index) => (
                      <div 
                        key={index} 
                        className="text-sm text-foreground p-3 rounded-xl bg-background/70 backdrop-blur-sm hover:bg-accent/30 transition-all duration-300 hover:scale-[1.02] font-medium"
                        style={{ animationDelay: `${index * 100}ms` }}
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
          <Card className="bg-white/95 dark:bg-card/95 border-0 shadow-xl backdrop-blur-xl overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardContent className="pt-8 relative">
              <div className="grid grid-cols-3 gap-6">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleStart}
                  disabled={state.isRunning && !state.isPaused}
                  className="flex-col h-24 gap-3 group transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <Play className="h-7 w-7 group-hover:scale-125 transition-transform duration-300" />
                  <span className="text-sm font-bold tracking-wide">
                    {state.isPaused ? "Resume" : "Start"}
                  </span>
                </Button>
                
                <Button
                  variant="warning"
                  size="lg"
                  onClick={handlePause}
                  disabled={!state.isRunning || state.isPaused}
                  className="flex-col h-24 gap-3 group transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <Pause className="h-7 w-7 group-hover:scale-125 transition-transform duration-300" />
                  <span className="text-sm font-bold tracking-wide">Pause</span>
                </Button>
                
                <Button
                  variant="info"
                  size="lg"
                  onClick={handleExit}
                  className="flex-col h-24 gap-3 group transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <Square className="h-7 w-7 group-hover:scale-125 transition-transform duration-300" />
                  <span className="text-sm font-bold tracking-wide">Stop</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Decorative Footer */}
          <div className="text-center py-6">
            <p className="text-sm text-white/70 dark:text-muted-foreground font-medium">
              Built with ✨ modern design
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};