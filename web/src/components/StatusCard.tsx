import React from 'react'
import { Card, Statistic } from 'antd'

interface StatusCardProps {
  title: string
  value: string | number
  suffix?: string
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, suffix }) => {
  return (
    <Card className="status-card" style={{ width: 200 }}>
      <Statistic title={title} value={value} suffix={suffix} />
    </Card>
  )
}
