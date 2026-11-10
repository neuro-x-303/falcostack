import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { DatabasePage } from '@/pages/DatabasePage';
import { DynamicDbPage } from '@/pages/DynamicDbPage';
import { ApisPage } from '@/pages/ApisPage';
import { HostingPage } from '@/pages/HostingPage';
import { LiveSyncPage } from '@/pages/LiveSyncPage';
import { EdgePricingPage } from '@/pages/EdgePricingPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/dynamic-db" element={<DynamicDbPage />} />
          <Route path="/apis" element={<ApisPage />} />
          <Route path="/hosting" element={<HostingPage />} />
          <Route path="/live-sync" element={<LiveSyncPage />} />
          <Route path="/edge-pricing" element={<EdgePricingPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
