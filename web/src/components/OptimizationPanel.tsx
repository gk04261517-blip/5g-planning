import React, { useState } from 'react'
import { Card, Button, InputNumber, Form, Space, message, Table } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { runOptimization } from '../api/simulation'
import { StatusCard } from './StatusCard'

export const OptimizationPanel: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [form] = Form.useForm()

  const handleRun = async () => {
    const values = form.getFieldsValue()
    setLoading(true)
    try {
      const data = await runOptimization(
        [values.width || 5000, values.height || 5000],
        values.numBs || 3,
        values.iterations
      )
      setResult(data.result)
      message.success('参数优化完成')
    } catch (error) {
      message.error('优化运行失败')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '基站ID', dataIndex: 'id', key: 'id' },
    { title: 'X坐标', dataIndex: 'x', key: 'x' },
    { title: 'Y坐标', dataIndex: 'y', key: 'y' },
    { title: '功率(dBm)', dataIndex: 'power', key: 'power' },
  ]

  const tableData = result?.optimalParams
    ? result.optimalParams.map((params: number[], idx: number) => ({
        id: `BS-${idx + 1}`,
        x: params[0].toFixed(1),
        y: params[1].toFixed(1),
        power: params[2].toFixed(1),
      }))
    : []

  return (
    <div className="simulation-panel">
      <h2 className="panel-title">参数优化</h2>

      <Form form={form} layout="inline" initialValues={{ width: 5000, height: 5000, numBs: 3, iterations: 100 }}>
        <Form.Item label="区域宽度(米)" name="width">
          <InputNumber min={1000} max={20000} />
        </Form.Item>
        <Form.Item label="区域高度(米)" name="height">
          <InputNumber min={1000} max={20000} />
        </Form.Item>
        <Form.Item label="基站数量" name="numBs">
          <InputNumber min={1} max={20} />
        </Form.Item>
        <Form.Item label="迭代次数" name="iterations">
          <InputNumber min={10} max={1000} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleRun}
            loading={loading}
          >
            运行优化
          </Button>
        </Form.Item>
      </Form>

      {result && (
        <>
          <Space style={{ marginTop: 24 }} size="large">
            <StatusCard
              title="最优覆盖率"
              value={result.coverage ? `${(result.coverage * 100).toFixed(1)}%` : 'N/A'}
            />
            <StatusCard title="基站数量" value={result.optimalParams?.length || 0} />
          </Space>

          <Card title="优化后的基站部署" style={{ marginTop: 24 }}>
            <Table
              dataSource={tableData}
              columns={columns}
              pagination={false}
              size="small"
            />
          </Card>
        </>
      )}
    </div>
  )
}
