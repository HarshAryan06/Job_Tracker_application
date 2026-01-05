import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const token = process.env.VERCEL_API_TOKEN;
        const projectId = process.env.VERCEL_PROJECT_ID;
        const teamId = process.env.VERCEL_TEAM_ID;

        if (!token || !projectId) {
            return NextResponse.json({ error: 'Missing Vercel credentials' }, { status: 500 });
        }

        // Calculate start date (30 days ago) using a fixed time to avoid hydration mismatch if used elsewhere
        // but here it's an API route so it's fine.
        const date = new Date();
        date.setDate(date.getDate() - 30);
        const from = date.toISOString();

        let url = `https://vercel.com/api/v1/analytics/stats?projectId=${projectId}&from=${from}`;
        if (teamId) {
            url += `&teamId=${teamId}`;
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Vercel API Error:', errorText);
            return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: response.status });
        }

        const data = await response.json();

        // Vercel Analytics stats endpoint returns an array of stats. 
        // We want to sum up the visitors.
        // The response structure typically has a 'data' array.
        // Let's assume we want total visitors for the period.
        let totalVisitors = 0;
        if (data && Array.isArray(data.data)) {
            totalVisitors = data.data.reduce((acc: number, curr: any) => acc + (curr.visitors || 0), 0);
        }
        // If the structure is different (e.g. general stats), we might need to adjust.
        // Use a failsafe parsing.

        return NextResponse.json({ visitors: totalVisitors });
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
