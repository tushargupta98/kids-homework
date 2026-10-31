import { MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { stopSpeaking } from '../../lib/speech';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    stopSpeaking();
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col bg-dots">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-safe pt-6 md:pt-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
