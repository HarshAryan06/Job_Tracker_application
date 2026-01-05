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
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
    },
    {
        key: 'pending' as const,
        label: 'Pending',
        icon: Clock,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
    },
    {
        key: 'interviews' as const,
        label: 'Interviews',
        icon: MessageSquare,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
    },
    {
        key: 'offers' as const,
        label: 'Offers',
        icon: Trophy,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
    },
    {
        key: 'rejected' as const,
        label: 'Rejected',
        icon: XCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
    },
    {
        key: 'total' as const,
        label: 'Total',
        icon: Briefcase,
        color: 'text-foreground',
        bgColor: 'bg-muted',
        borderColor: 'border-border',
    },
];

export function StatsSection({ stats }: StatsSectionProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {statConfig.map((stat, index) => (
                <Card
                    key={stat.key}
                    className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-foreground tracking-tight">
                                {stats[stat.key]}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">
                                {stat.label}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
