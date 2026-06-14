import React, { useState } from 'react'
import { Card, Button, InputNumber, Form, Space, message } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { runCoverageSimulation } from '../api/simulation'
import { ResultChart } from './ResultChart'
import { StatusCard } from './StatusCard'

export const CoveragePanel: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [form] = Form.useForm()

  const handleRun = async () => {
    const values = form.getFieldsValue()
    setLoading(true)
    try {
      const baseStations = [
        [0, 0, values.power1 || 46],
        [2000, 0, values.power2 || 46],
        [1000, 1732, values.power3 || 46],
      ]
      const data = await runCoverageSimulation(
        baseStations,
        values.resolution,
        values.maxDistance
      )
      setResult(data.result)
      message.success('覆盖预测完成')
    } catch (error) {
      message.error('仿真运行失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="simulation-panel">
      <h2 className="panel-title">覆盖预测仿真</h2>

      <Form form={form} layout="inline" initialValues={{ resolution: 50, maxDistance: 5000 }}>
        <Form.Item label="分辨率(米)" name="resolution">
          <InputNumber min={10} max={500} />
        </Form.Item>
        <Form.Item label="最大距离(米)" name="maxDistance">
          <InputNumber min={1000} max={20000} />
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
            <StatusCard
              title="覆盖面积"
              value={result.coverage ? `${(result.coverage.flat().filter((v: number) => v > 0).length / result.coverage.flat().length * 100).toFixed(1)}%` : 'N/A'}
            />
            <StatusCard
              title="网格大小"
              value={result.coverage ? `${result.coverage.length}x${result.coverage[0]?.length}` : 'N/A'}
            />
          </Space>

          <div className="chart-container">
            <ResultChart
              type="heatmap"
              data={result.coverage}
              xLabels={result.xGrid}
              yLabels={result.yGrid}
            />
          </div>
        </>
      )}
    </div>
  )
}
