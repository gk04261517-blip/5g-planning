import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CoveragePanel } from './components/CoveragePanel'
import { CapacityPanel } from './components/CapacityPanel'
import { OptimizationPanel } from './components/OptimizationPanel'
import { ModelChat } from './components/ModelChat'
import { LogPanel } from './components/LogPanel'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CoveragePanel />} />
          <Route path="/coverage" element={<CoveragePanel />} />
          <Route path="/capacity" element={<CapacityPanel />} />
          <Route path="/optimization" element={<OptimizationPanel />} />
          <Route path="/chat" element={<ModelChat />} />
          <Route path="/logs" element={<LogPanel />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
