'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface salesChartProps {
    data: any[]
}

export const SalesPerMonthChart: React.FC<salesChartProps> = ({
    data
}) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                   stroke="#888888"
                   fontSize={12}
                   tickLine={false}
                   axisLine={false} 
                   tickFormatter={(value) => `${value}€`}
                />
                <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}