import React from 'react';
import {
  Home,
  Search,
  PlusCircle,
  Briefcase,
  MessageSquare,
  User as UserIcon,
  Bell,
  MapPin,
  Shield,
  Smartphone
} from 'lucide-react';
import { User, UserLocation, UserRole } from '../types';

export type MainTab = 'home' | 'search' | 'post_work' | 'my_work' | 'messages' | 'profile';

interface NavigationProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  currentUser: User | null;
  currentLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenStorePublish: () => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  currentLocation,
  onOpenLocationPicker,
  onOpenAuth,
  onOpenNotifications,
  onOpenStorePublish,
  unreadMessagesCount,
  unreadNotificationsCount
}) => {
  return (
    <>
      {/* Top Desktop & Mobile Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                K
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    KAAMLY
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded text-[10px] font-bold">
                    INDIA
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                  Local Work, Trusted People
                </p>
              </div>
            </button>

            {/* Location Selector Pill */}
            <button
              onClick={onOpenLocationPicker}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 rounded-full text-xs font-semibold text-slate-200 transition-all ml-1 sm:ml-4 max-w-[150px] sm:max-w-[240px] truncate cursor-pointer shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                {currentLocation.city || 'Select City'}, {currentLocation.state?.split(' ')[0]}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'home'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onSelectTab('search')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'search'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Search
            </button>

            <button
              onClick={() => onSelectTab('post_work')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'post_work'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Post Work
            </button>

            <button
              onClick={() => onSelectTab('my_work')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'my_work'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              My Work
            </button>

            <button
              onClick={() => onSelectTab('messages')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors relative ${
                activeTab === 'messages'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Messages
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Play Store Deployment Hub Button */}
            <button
              onClick={onOpenStorePublish}
              title="Google Play & App Store Publication Hub"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Play Store Ready</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    {currentUser.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-xs font-bold text-white max-w-[90px] truncate hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300">
                  {currentUser.role === 'worker' ? 'Worker' : 'User'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 py-1.5 px-3">
        <div className="grid grid-cols-6 items-center">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => onSelectTab('search')}
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              activeTab === 'search' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px]">Search</span>
          </button>

          <button
            onClick={() => onSelectTab('post_work')}
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              activeTab === 'post_work' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px]">Post Work</span>
          </button>

          <button
            onClick={() => onSelectTab('my_work')}
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              activeTab === 'my_work' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px]">My Work</span>
          </button>

          <button
            onClick={() => onSelectTab('messages')}
            className={`flex flex-col items-center gap-1 py-1 transition-colors relative ${
              activeTab === 'messages' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              )}
            </div>
            <span className="text-[10px]">Chat</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              activeTab === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};
