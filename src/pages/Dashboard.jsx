import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import ActivityFeed from '../components/ActivityFeed';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiUsers, FiTrendingUp, FiShoppingBag } = FiIcons;

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up', icon: FiDollarSign },
  { title: 'Active Users', value: '2,338', change: '+15.2%', trend: 'up', icon: FiUsers },
  { title: 'Sales', value: '1,203', change: '-3.1%', trend: 'down', icon: FiShoppingBag },
  { title: 'Conversion Rate', value: '3.42%', change: '+4.3%', trend: 'up', icon: FiTrendingUp },
];

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard overview</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            Create Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Revenue Overview</h2>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
               <RevenueChart />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ActivityFeed />
        </motion.div>
      </div>
    </motion.div>
  );
}