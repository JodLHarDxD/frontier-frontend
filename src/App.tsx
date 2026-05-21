import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Preloader } from './components/Preloader';

import { lazy, Suspense } from 'react';
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Work = lazy(() => import('./pages/Work').then((m) => ({ default: m.Work })));
const Lab = lazy(() => import('./pages/Lab').then((m) => ({ default: m.Lab })));
const Motion = lazy(() => import('./pages/Motion').then((m) => ({ default: m.Motion })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">{loading && <Preloader key="preloader" />}</AnimatePresence>

      {!loading && (
        <Layout>
          <AnimatePresence mode="wait">
            <Suspense fallback={null}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/lab" element={<Lab />} />
                <Route path="/motion" element={<Motion />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </Layout>
      )}
    </>
  );
}

export default App;
