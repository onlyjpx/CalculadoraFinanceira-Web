# Calculadora Financeira - Frontend (Vite + React)

Interface simples para testar o backend Kotlin/Spring (porta 8080).

## Endpoints cobertos
- GET `/` (ping)
- POST `/api/simples/calculate` com corpo JSON `{ capital, montante, juros, taxa, tempo }` (campos opcionais, use números ou deixe em branco)
- POST `/api/desconto-comercial/calculate` com corpo JSON `{ nominal, valorPresente, desconto, taxaDesconto, tempo, taxaEfetiva }` (use números ou deixe em branco)

## Configuração
Arquivo `.env.development` em `app/` (usa proxy do Vite para evitar CORS):

```
VITE_API_BASE_URL=/backend
```

## Rodando
1. Garanta que o backend está em execução em `http://localhost:8080` (o proxy `/backend` encaminhará as chamadas).
2. No diretório `app/`:

```
npm install
npm run dev
```

Abra no navegador o endereço exibido (ex: `http://localhost:5173`).

## Uso
- O card "Teste de Conexão" verifica o ping do backend.
- Preencha ao menos 3 campos no formulário "Capitalização Simples" e clique em "Calcular". O resultado (campo calculado) aparece em JSON.
- No formulário "Desconto Comercial":
	- Para calcular a taxa de desconto comercial (d):
		- (nominal + valorPresente + tempo) OU (nominal + desconto + tempo) OU (taxaEfetiva + tempo)
		- Escolha "Taxa de Desconto" como alvo.
	- Para calcular a taxa efetiva (iₑ):
		- (taxaDesconto + tempo) OU (nominal + valorPresente + tempo)
		- Escolha "Taxa Efetiva" como alvo.

## Estrutura espelhando backend
- `src/services/*` chamadas HTTP.
- `src/controllers/*` validação e orquestração.
- `src/components/*` UI.

## Notas
- A taxa deve ser informada em percentual (ex: 2 para 2%).
- Campos vazios são enviados como `null`.
-- Fórmulas:
	- Desconto comercial simples: `VP = N (1 - d n)`, `D = N d n` → `d = D/(N n)` ; `d = (1 - VP/N)/n` ; `d = iₑ / (1 + iₑ n)`.
	- Taxa efetiva equivalente: `iₑ = d / (1 - d n)` ; `iₑ = ((N/VP) - 1)/n`.
