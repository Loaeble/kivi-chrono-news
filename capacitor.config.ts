import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a1db54718f1846e2b799d9a6bfbb6f7a',
  appName: 'News Scraper',
  webDir: 'dist',
  server: {
    url: 'https://a1db5471-8f18-46e2-b799-d9a6bfbb6f7a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false
    }
  }
};

export default config;