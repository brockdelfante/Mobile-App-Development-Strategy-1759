import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiMessageSquare, FiUserPlus, FiUploadCloud } = FiIcons;

const activities = [
  { id: 1, type: 'success', content: 'Project Alpha deployed successfully', time: '2h ago', icon: FiCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 2, type: 'comment', content: 'Sarah commented on your design', time: '4h ago', icon: FiMessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, type: 'user', content: 'New user registration: John Doe', time: '6h ago', icon: FiUserPlus, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 4, type: 'upload', content: 'Monthly report uploaded', time: '12h ago', icon: FiUploadCloud, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 5, type: 'success', content: 'Server backup completed', time: '1d ago', icon: FiCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex items-start gap-4">
              <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full shadow-sm ring-4 ring-white ${activity.bg} shrink-0`}>
                <SafeIcon icon={activity.icon} className={`w-5 h-5 ${activity.color}`} />
              </div>
              <div className="flex-1 pt-2">
                <p className="text-sm text-slate-700 font-medium">{activity.content}</p>
                <span className="text-xs text-slate-400 mt-1 block">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}