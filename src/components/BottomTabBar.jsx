import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag, FileText, Mail, User } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

const TABS = [
  { path: '/', icon: HomeIcon, labelFA: 'خانه', labelEN: 'Home' },
  { path: '/shop', icon: ShoppingBag, labelFA: 'فروشگاه', labelEN: 'Shop' },
  { path: '/blog', icon: FileText, labelFA: 'وبلاگ', labelEN: 'Blog' },
  { path: '/contact', icon: Mail, labelFA: 'تماس', labelEN: 'Contact' },
  { path: '/account', icon: User, labelFA: 'حساب', labelEN: 'Account' },
];

// Map any pathname to its owning bottom-tab.
// Product detail and checkout belong to the Shop tab.
const TAB_PREFIXES = [
  { path: '/', prefixes: ['/'] },
  { path: '/shop', prefixes: ['/shop', '/product', '/checkout'] },
  { path: '/blog', prefixes: ['/blog'] },
  { path: '/contact', prefixes: ['/contact'] },
  { path: '/account', prefixes: ['/account'] },
];

function getTabForPath(pathname) {
  if (pathname === '/') return '/';
  for (const { path, prefixes } of TAB_PREFIXES) {
    if (path === '/') continue;
    if (prefixes.some(p => pathname.startsWith(p))) return path;
  }
  return '/';
}

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useApp();
  const isFA = lang === 'fa';

  // Per-tab navigation stacks — each tab remembers where the user left off.
  const tabStacks = useRef({});
  const activeTabRef = useRef(null);
  const isSwitchingRef = useRef(false);

  // Initialise stacks once
  if (Object.keys(tabStacks.current).length === 0) {
    TABS.forEach(t => { tabStacks.current[t.path] = []; });
  }

  const currentPath = location.pathname + location.search;
  const activeTab = getTabForPath(location.pathname);

  // Track navigation within the active tab
  useEffect(() => {
    if (isSwitchingRef.current) {
      // This location change was a tab switch — don't push, just update the active tab
      isSwitchingRef.current = false;
      activeTabRef.current = activeTab;
      return;
    }
    // Push to the current tab's stack (avoid duplicates)
    const stack = tabStacks.current[activeTab] || [];
    if (stack[stack.length - 1] !== currentPath) {
      stack.push(currentPath);
    }
    activeTabRef.current = activeTab;
  }, [currentPath, activeTab]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTabClick = (path) => {
    const currentTab = activeTabRef.current || activeTab;

    if (path === currentTab) {
      // Re-tapping the active tab: reset to tab root (existing behavior)
      if (location.pathname !== path || location.search) {
        tabStacks.current[path] = [path];
        navigate(path);
      }
    } else {
      // Switching to a different tab: restore that tab's last position
      isSwitchingRef.current = true;
      const targetStack = tabStacks.current[path] || [];
      if (targetStack.length > 0) {
        navigate(targetStack[targetStack.length - 1]);
      } else {
        tabStacks.current[path] = [path];
        navigate(path);
      }
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[60]"
      style={{
        paddingBottom: 'var(--safe-area-bottom)',
        background: 'var(--bottom-bar-bg)',
        backdropFilter: 'blur(48px) saturate(240%)',
        WebkitBackdropFilter: 'blur(48px) saturate(240%)',
        borderTop: '1px solid var(--bottom-bar-border)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 -8px 32px rgba(0,0,0,0.3)',
      }}
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around px-1" style={{ height: '56px' }}>
        {TABS.map(tab => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className="flex flex-col items-center justify-center gap-1 transition-all rounded-xl"
              style={{
                minWidth: '44px',
                minHeight: '44px',
                color: active ? 'var(--accent)' : 'var(--fg-muted)',
              }}
              aria-label={isFA ? tab.labelFA : tab.labelEN}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                size={20}
                style={{
                  color: active ? 'var(--accent)' : 'var(--fg-muted)',
                  transition: 'color 0.2s ease',
                }}
              />
              <span
                className="font-body font-semibold leading-none"
                style={{
                  fontSize: '14px',
                  color: active ? 'var(--accent)' : 'var(--fg-muted)',
                }}
              >
                {isFA ? tab.labelFA : tab.labelEN}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}