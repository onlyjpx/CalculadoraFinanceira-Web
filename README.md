# Calculadora Financeira (React + Kotlin/Spring)

Projeto **em desenvolvimento**.

Aplicação para cálculos de matemática financeira com:
- Frontend: Vite + React (pasta `app/`)
- Backend: Kotlin + Spring Boot (pasta `backend/`)

## Funcionalidades
- Capitalização simples
- Capitalização composta
- Desconto comercial
- Taxas equivalentes (conversão de taxa efetiva entre períodos: mensal, semestral, anual, etc.)
- Taxas abaixo (nominal ↔ proporcional)

## Requisitos
- Node.js (LTS recomendado) + npm
- Java 17+ (para o backend)
- Gradle (embutido via Gradle Wrapper)

## Como rodar

### 1) Backend (porta 8080)
Abra um terminal na pasta `backend/` e execute:

```bash
.\gradlew.bat bootRun
```

- **IntelliJ IDEA**: Abra a pasta `backend/`, aguarde a indexação do Gradle e rode a classe `BackendApplication` (ícone ▶ verde ao lado do `fun main`).

O backend deve iniciar em `http://localhost:8080`.

### 2) Frontend (porta 5173)
Abra outro terminal na pasta `app/`:

- `npm install`
- `npm run dev`

Acesse a URL exibida no terminal (normalmente `http://localhost:5173`).

## Configuração de API no Frontend
O frontend usa `VITE_API_BASE_URL`.

- Se você estiver chamando direto o backend:
  - `VITE_API_BASE_URL=http://localhost:8080`

- Se você estiver usando proxy do Vite (ver `app/README.md`):
  - `VITE_API_BASE_URL=/backend`

## Endpoints (Backend)
- `POST /api/simples/calculate`
- `POST /api/composta/calculate`
- `POST /api/desconto-comercial/calculate`
- `POST /api/taxa-equivalente/calculate`
- `POST /api/taxas-abaixo/calculate`

## Estrutura do repositório
- `app/`: UI (React)
- `backend/`: API (Spring Boot)

## Observações
- As taxas são informadas em percentual (ex: `2` para 2%).
- Campos vazios no frontend são enviados como `null`.
- Este projeto ainda está em desenvolvimento; funcionalidades e layout podem mudar.
