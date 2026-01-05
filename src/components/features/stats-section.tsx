'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import {
    Send,
    Clock,
    MessageSquare,
    Trophy,
    XCircle,
    Briefcase
} from 'lucide-react';

interface StatsSectionProps {
    stats: DashboardStats;
}

const statConfig = [
    {
        key: 'applied' as const,
        label: 'Applied',
        icon: Send,
        gradient: 'from-blue-500 to-cyan-500',
        textColor: 'text-blue-500',
    },
    {
        key: 'pending' as const,
        label: 'Pending',
        icon: Clock,
        gradient: 'from-amber-500 to-yellow-500',
        textColor: 'text-amber-500',
    },
    {
        key: 'interviews' as const,
        label: 'Interviews',
        icon: MessageSquare,
        gradient: 'from-purple-500 to-pink-500',
        textColor: 'text-purple-500',
    },
    {
        key: 'offers' as const,
        label: 'Offers',
        icon: Trophy,
        gradient: 'from-emerald-500 to-green-500',
        textColor: 'text-emerald-500',
    },
    {
        key: 'rejected' as const,
        label: 'Rejected',
        icon: XCircle,
        gradient: 'from-red-500 to-rose-500',
        textColor: 'text-red-500',
    },
    {
        key: 'total' as const,
        label: 'Total Apps',
        icon: Briefcase,
        gradient: 'from-slate-600 to-slate-700',
        textColor: 'text-slate-500 dark:text-slate-400',
    },
];

export function StatsSection({ stats }: StatsSectionProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statConfig.map((stat, index) => (
                <Card
                    key={stat.key}
                    className="card-hover overflow-hidden group animate-fade-in-up"
                    style={{ animationDelay: `${0.4 + index * 0.08}s` }}
                >
                    <CardContent className="p-4 flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 ease-out group-hover:scale-110`}
                        >
                            <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${stat.textColor}`}>
                                {stats[stat.key]}
                            </p>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
