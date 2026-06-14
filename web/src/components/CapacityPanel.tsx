import React, { useState } from 'react'
import { Card, Button, InputNumber, Form, Space, message } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { runCapacitySimulation } from '../api/simulation'
import { ResultChart } from './ResultChart'
import { StatusCard } from './StatusCard'

export const CapacityPanel: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [form] = Form.useForm()

  const handleRun = async () => {
    const values = form.getFieldsValue()
    setLoading(true)
    try {
      const baseStations = [
        [0, 0, 46],
        [2000, 0, 46],
        [1000, 1732, 46],
      ]
      const userLocations = Array.from({ length: values.userCount || 50 }, () => [
        Math.random() * 3000 - 500,
        Math.random() * 3000 - 500,
      ])
      const data = await runCapacitySimulation(
        baseStations,
        userLocations,
        values.bandwidth
      )
      setResult(data.result)
      message.success('容量分析完成')
    } catch (error) {
      message.error('仿真运行失败')
    } finally {
      setLoading(false)
    }
  }

  const avgCapacity = result?.capacity
    ? (result.capacity.reduce((a: number, b: number) => a + b, 0) / result.capacity.length).toFixed(1)
    : 'N/A'

  const avgSinr = result?.sinr
    ? (result.sinr.reduce((a: number, b: number) => a + b, 0) / result.sinr.length).toFixed(1)
    : 'N/A'

  return (
    <div className="simulation-panel">
      <h2 className="panel-title">容量分析仿真</h2>

      <Form form={form} layout="inline" initialValues={{ userCount: 50, bandwidth: 20 }}>
        <Form.Item label="用户数" name="userCount">
          <InputNumber min={10} max={500} />
        </Form.Item>
        <Form.Item label="带宽(MHz)" name="bandwidth">
          <InputNumber min={5} max={100} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleRun}
            loading={loading}
          >
            运行仿真
          </Button>
        </Form.Item>
      </Form>

      {result && (
        <>
          <Space style={{ marginTop: 24 }} size="large">
            <StatusCard title="平均容量" value={`${avgCapacity} Mbps`} />
            <StatusCard title="平均SINR" value={`${avgSinr} dB`} />
            <StatusCard title="用户数" value={result.capacity?.length || 0} />
          </Space>

          <div className="chart-container">
            <ResultChart
              type="bar"
              data={result.capacity?.slice(0, 30)}
              title="用户容量分布"
            />
          </div>
        </>
      )}
    </div>
  )
}
