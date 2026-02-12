import { useState } from 'react';
import { testPing } from '../controllers/simplesController';

export default function TestPing() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handlePing = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await testPing();
      setResult(typeof res === 'string' ? res : JSON.stringify(res));
    } catch (e) {
      setError(e?.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Teste de Conexão</h2>
      <button onClick={handlePing} disabled={loading}>
        {loading ? 'Testando...' : 'PING /'}
      </button>
      {result && <p><strong>Resposta:</strong> {result}</p>}
      {error && <p style={{ color: 'crimson' }}><strong>Erro:</strong> {error}</p>}
    </div>
  );
}
