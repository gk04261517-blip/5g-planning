import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, Select, message } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { chatWithModel } from '../api/model'
import type { ChatMessage } from '../types'

const { TextArea } = Input

export const ModelChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelType, setModelType] = useState('default')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const context = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const data = await chatWithModel(input, context, modelType)

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      message.error('对话请求失败')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="simulation-panel">
      <h2 className="panel-title">模型对话</h2>

      <Select
        value={modelType}
        onChange={setModelType}
        style={{ width: 200, marginBottom: 16 }}
        options={[
          { value: 'default', label: '默认模型' },
          { value: 'advanced', label: '高级模型' },
        ]}
      />

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
              开始与无线网络仿真助手对话...
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题..."
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
