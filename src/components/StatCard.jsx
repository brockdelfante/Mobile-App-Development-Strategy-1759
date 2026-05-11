import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowUpRight, FiArrowDownRight } = FiIcons;

export default function StatCard({ title, value, change, trend, icon }) {
  const isUp = trend === 'up';
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform translate-x-2 -translate-y-2">
        <SafeIcon icon={icon} className="w-24 h-24 text-indigo-600" />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-2.5 bg-indigo-50 rounded-xl">
          <SafeIcon icon={icon} className="w-5 h-5 text-indigo-600" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
          isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <SafeIcon icon={isUp ? FiArrowUpRight : FiArrowDownRight} className="w-3.5 h-3.5" />
          <span>{change}</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}