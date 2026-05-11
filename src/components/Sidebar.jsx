import React from 'react';
import { NavLink } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiPieChart, FiSettings, FiFolder, FiX, FiActivity } = FiIcons;

const navItems = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Analytics', icon: FiPieChart, path: '/analytics' },
  { name: 'Projects', icon: FiFolder, path: '/projects' },
  { name: 'Team', icon: FiUsers, path: '/team' },
  { name: 'Reports', icon: FiActivity, path: '/reports' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
];

export default function Sidebar({ onClose }) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-indigo-600">
          <SafeIcon icon={FiActivity} className="w-6 h-6 stroke-[3]" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Nexus</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
          <SafeIcon icon={FiX} className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <SafeIcon 
              icon={item.icon} 
              className={`w-5 h-5 ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400'}`} 
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <h4 className="text-sm font-semibold mb-1">Go Premium</h4>
          <p className="text-xs text-indigo-100 mb-3 line-clamp-2">Unlock all features and advanced analytics.</p>
          <button className="w-full bg-white text-indigo-600 text-sm font-medium py-2 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}