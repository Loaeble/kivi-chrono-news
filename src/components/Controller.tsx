import { useState, useRef } from 'react';

export interface ControllerState {
  isRunning: boolean;
  isPaused: boolean;
  imageCount: number;
  statusMessage: string;
  logs: string[];
}

export class Controller {
  public state: ControllerState;
  public setState: (state: ControllerState) => void;
  private intervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  private scrapingSimulation: boolean = false;

  constructor(
    state: ControllerState,
    setState: (state: ControllerState) => void,
    intervalRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) {
    this.state = state;
    this.setState = setState;
    this.intervalRef = intervalRef;
  }

  start() {
    if (this.state.isRunning && !this.state.isPaused) return;

    const newState = {
      ...this.state,
      isRunning: true,
      isPaused: false,
      statusMessage: 'Scraping started...',
      logs: [...this.state.logs, `${new Date().toLocaleTimeString()}: Scraping started`]
    };

    this.setState(newState);
    this.state = newState;
    this.startScrapingSimulation();
  }

  pause() {
    if (!this.state.isRunning || this.state.isPaused) return;

    const newState = {
      ...this.state,
      isPaused: true,
      statusMessage: 'Scraping paused',
      logs: [...this.state.logs, `${new Date().toLocaleTimeString()}: Scraping paused`]
    };

    this.setState(newState);
    this.state = newState;
    this.stopScrapingSimulation();
  }

  resume() {
    if (!this.state.isRunning || !this.state.isPaused) return;

    const newState = {
      ...this.state,
      isPaused: false,
      statusMessage: 'Scraping resumed...',
      logs: [...this.state.logs, `${new Date().toLocaleTimeString()}: Scraping resumed`]
    };

    this.setState(newState);
    this.state = newState;
    this.startScrapingSimulation();
  }

  stop() {
    const newState = {
      ...this.state,
      isRunning: false,
      isPaused: false,
      statusMessage: 'Scraping stopped',
      logs: [...this.state.logs, `${new Date().toLocaleTimeString()}: Scraping stopped`]
    };

    this.setState(newState);
    this.state = newState;
    this.stopScrapingSimulation();
  }

  private startScrapingSimulation() {
    if (this.scrapingSimulation) return;
    
    this.scrapingSimulation = true;
    this.intervalRef.current = setInterval(() => {
      if (!this.scrapingSimulation || this.state.isPaused) return;

      const newImageCount = this.state.imageCount + 1;
      const newState = {
        ...this.state,
        imageCount: newImageCount,
        statusMessage: `Processing image ${newImageCount}...`,
        logs: [...this.state.logs, `${new Date().toLocaleTimeString()}: Image ${newImageCount} created`]
      };

      this.setState(newState);
      this.state = newState;
    }, 2000); // Create new image every 2 seconds
  }

  private stopScrapingSimulation() {
    this.scrapingSimulation = false;
    if (this.intervalRef.current) {
      clearInterval(this.intervalRef.current);
      this.intervalRef.current = null;
    }
  }
}

export const useController = () => {
  const [state, setState] = useState<ControllerState>({
    isRunning: false,
    isPaused: false,
    imageCount: 0,
    statusMessage: 'Ready to start',
    logs: ['Application initialized']
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controllerRef = useRef<Controller | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new Controller(state, setState, intervalRef);
  }

  // Update controller state reference
  controllerRef.current.state = state;
  controllerRef.current.setState = setState;

  return {
    state,
    controller: controllerRef.current
  };
};