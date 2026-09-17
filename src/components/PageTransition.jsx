import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    setShowBar(true);
    const timer = setTimeout(() => setShowBar(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {showBar && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden pointer-events-none">
          <div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #E8C547 30%, #F5E6B8 50%, #E8C547 70%, transparent)',
              animation: 'loadingBar 0.6s ease-out forwards',
              boxShadow: '0 0 12px rgba(212,175,55,0.5)',
            }}
          />
        </div>
      )}
      <div key={location.pathname} className="page-enter-animation">
        {children}
      </div>
    </>
  );
}