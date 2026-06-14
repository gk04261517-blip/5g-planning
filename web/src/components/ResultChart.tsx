import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ResultChartProps {
  type: 'bar' | 'heatmap' | 'line'
  data: any
  title?: string
  xLabels?: number[]
  yLabels?: number[]
}

export const ResultChart: React.FC<ResultChartProps> = ({
  type,
  data,
  title,
}) => {
  if (type === 'bar' && Array.isArray(data)) {
    const chartData = data.map((value, index) => ({
      name: `用户${index + 1}`,
      value: typeof value === 'number' ? Number(value.toFixed(2)) : 0,
    }))

    return (
      <div>
        {title && <h4 style={{ marginBottom: 16 }}>{title}</h4>}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="容量 (Mbps)">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#1890ff" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'heatmap') {
    // 简化热力图展示
    return (
      <div>
        {title && <h4 style={{ marginBottom: 16 }}>{title}</h4>}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(data[0]?.length || 20, 40)}, 1fr)`,
            gap: 1,
            maxHeight: 400,
            overflow: 'auto',
          }}
        >
          {Array.isArray(data) &&
            data.slice(0, 40).map((row, i) =>
              Array.isArray(row) &&
              row.slice(0, 40).map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  style={{
                    width: '100%',
                    paddingBottom: '100%',
                    backgroundColor: cell > 0 ? '#52c41a' : '#f5222d',
                    opacity: 0.7,
                  }}
                />
              ))
            )}
        </div>
      </div>
    )
  }

  return <div>Unsupported chart type</div>
}
