import { useState } from 'react'
import './App.css'
import SimplesForm from './components/SimplesForm'
import CompostaForm from './components/CompostaForm'
import DescontoComercialForm from './components/DescontoComercialForm'
import TaxaEquivalenteForm from './components/TaxaEquivalenteForm'
import AmortizacaoForm from './components/AmortizacaoForm'
import VplForm from './components/VplForm'

const tabs = [
  { key: 'simples', label: 'Simples', icon: '∑' },
  { key: 'composta', label: 'Composta', icon: 'xⁿ' },
  { key: 'desconto', label: 'Desconto', icon: '%' },
  { key: 'taxas', label: 'Taxas', icon: '≈' },
  { key: 'amortizacao', label: 'Amort.', icon: '⊞' },
  { key: 'vpl', label: 'VPL', icon: '$' },
]

function App() {
  const [activeTab, setActiveTab] = useState('simples')

  return (
    <div className="min-h-dvh bg-[#08080c] flex items-start justify-center px-4 py-8 md:py-12 text-slate-100">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-lg font-bold select-none">
            Σ
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Calculadora Financeira</h1>
            <p className="text-[11px] text-slate-500">Matemática financeira • Cálculos precisos</p>
          </div>
        </div>

        {/* Calculator Shell */}
        <div className="bg-[#111118] rounded-2xl border border-slate-700/30 shadow-2xl shadow-black/60 overflow-hidden">
          {/* Mode Tabs */}
          <nav className="flex overflow-x-auto border-b border-slate-700/30 bg-[#0e0e15]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-2 py-3.5 text-xs sm:text-sm font-medium transition-all relative
                  ${activeTab === tab.key
                    ? 'text-teal-400 bg-teal-500/[0.07] tab-glow'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                  }`}
              >
                <span className="hidden sm:inline mr-1 text-[10px] opacity-50">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="p-5 sm:p-6">
            {activeTab === 'simples' && <SimplesForm />}
            {activeTab === 'composta' && <CompostaForm />}
            {activeTab === 'desconto' && <DescontoComercialForm />}
            {activeTab === 'taxas' && <TaxaEquivalenteForm />}
            {activeTab === 'amortizacao' && <AmortizacaoForm />}
            {activeTab === 'vpl' && <VplForm />}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-600 mt-4 select-none">
          Backend Spring Boot :8080 &bull; Frontend Vite + React
        </p>
      </div>
    </div>
  )
}

export default App
