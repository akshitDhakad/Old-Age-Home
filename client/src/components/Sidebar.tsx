/**
 * Sidebar Navigation Component
 * Modern sidebar navigation for dashboards
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
  badge?: number;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  onItemClick?: (itemId: string) => void;
  className?: string;
}

export function Sidebar({ items, onItemClick, className = '' }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col ${className}`}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Sanjeevani</h2>
            <p className="text-xs text-gray-500">Elderly Care</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user?.role || 'user'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0 overscroll-contain">
        {items.map((item) => {
          const isActive =
            item.active || (item.path && location.pathname === item.path);

          return (
            <div key={item.id}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200  ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => onItemClick?.(item.id)}
                >
                  <div
                    className={`${isActive ? 'text-primary-600' : 'text-gray-500'}`}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.();
                    onItemClick?.(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div
                    className={`${isActive ? 'text-primary-600' : 'text-gray-500'}`}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 font-medium text-left">
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
