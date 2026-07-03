import { useState, useRef, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from "@/contexts/AuthContext";

import LogoutButton from '@/components/LogoutButton';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (!window.confirm(t('header.confirm_logout', { defaultValue: 'Are you sure you want to logout?' }))) return;
    try {
      await logout();
      setIsOpen(false);
    } catch {
      alert(t('header.error_logout', { defaultValue: 'Error logging out.' }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none group"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold dark:text-white/90 text-gray-900 leading-tight">
            {user?.name || t('header.admin', { defaultValue: 'Admin' })}
          </p>
        </div>

        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:ring-2 ring-blue-600 transition-all">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Perfil" className="h-full w-full object-cover" />
          ) : (
            <span className="text-blue-600 font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 origin-top-right animate-in fade-in slide-in-from-top-2">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t('header.edit_profile', { defaultValue: 'My profile' })}
          </Link>

          <div className="h-px bg-gray-100 my-1"></div>

          <LogoutButton onClick={handleLogout}
            label={t('header.logout', { defaultValue: 'Logout' })}
          />
        </div>
      )}
    </div>
  );
}
