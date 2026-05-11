import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiSearch, FiBell, FiChevronDown } = FiIcons;

export default function Header({ onMenuClick }) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden mr-4 text-slate-500 hover:text-slate-700"
        >
          <SafeIcon icon={FiMenu} className="w-6 h-6" />
        </button>
        
        <div className="max-w-md w-full hidden sm:block relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SafeIcon icon={FiSearch} className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-slate-400 hover:text-slate-500 transition-colors p-1">
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          <SafeIcon icon={FiBell} className="h-5 w-5" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        <button className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors">
          <img
            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
          <span className="text-sm font-medium text-slate-700 hidden sm:block">Alex D.</span>
          <SafeIcon icon={FiChevronDown} className="h-4 w-4 text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}