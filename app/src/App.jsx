import './App.css'
import SimplesForm from './components/SimplesForm'
import DescontoComercialForm from './components/DescontoComercialForm'
import TaxaEquivalenteForm from './components/TaxaEquivalenteForm'

function App() {
  return (
  <div className="min-h-dvh bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Calculadora Financeira</h1>
          <p className="text-slate-400 mt-1">Capitalização simples, desconto comercial e taxas equivalentes (backend em 8080)</p>
        </header>
        <div className="space-y-6">
          <SimplesForm />
          <DescontoComercialForm />
          <TaxaEquivalenteForm />
        </div>
      </div>
    </div>
  )
}

export default App
