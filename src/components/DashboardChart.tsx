"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardChartProps {
    totalBudget: number;
    totalExecuted: number;
}

const DashboardChart = ({ totalBudget, totalExecuted }: DashboardChartProps) => {
    const data = [
        {
            name: 'Presupuesto',
            Monto: totalBudget,
            fill: '#4f46e5', // indigo-600
        },
        {
            name: 'Ejecutado',
            Monto: totalExecuted, // This should include previous + current valuation
            fill: '#10b981', // emerald-500
        },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Estado del Proyecto</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="Monto" radius={[0, 4, 4, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardChart;
