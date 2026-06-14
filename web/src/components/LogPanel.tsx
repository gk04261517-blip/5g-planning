import React, { useState, useEffect } from 'react'
import { Button, Badge, Space, Tag } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { getLogs, getLogStats } from '../api/logs'
import type { LogEntry } from '../types'

export const LogPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const [logsData, statsData] = await Promise.all([
        getLogs(200),
        getLogStats(),
      ])
      setLogs(logsData.logs || [])
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'red'
      case 'warn':
        return 'orange'
      case 'info':
        return 'blue'
      case 'debug':
        return 'green'
      default:
        return 'default'
    }
  }

  return (
    <div className="simulation-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="panel-title" style={{ margin: 0 }}>系统日志</h2>
        <Space>
          {stats && (
            <>
              <Badge count={stats.error} showZero color="red" />
              <Badge count={stats.warn} showZero color="orange" />
              <Badge count={stats.info} showZero color="blue" />
            </>
          )}
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchLogs}
            loading={loading}
          >
            刷新
          </Button>
        </Space>
      </div>

      <div className="log-panel">
        {logs.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            暂无日志
          </div>
        )}
        {logs.map((log, idx) => (
          <div key={idx} className={`log-entry ${log.level}`}>
            <Space>
              <Tag color={getLevelColor(log.level)}>{log.level.toUpperCase()}</Tag>
              <span style={{ color: '#8c8c8c' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span>{log.message}</span>
            </Space>
          </div>
        ))}
      </div>
    </div>
  )
}
