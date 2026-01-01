
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, delta, icon: Icon, color }) => (
  <div className="glass-card p-6 rounded-3xl hover:border-white/20 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-slate-800/50 ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
      <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/5 ${color}`}>
        {delta}
      </span>
    </div>
    <h4 className="text-sm text-slate-500 font-medium mb-1">{title}</h4>
    <p className="text-3xl font-bold tracking-tight">{value}</p>
  </div>
);

export default StatCard;
