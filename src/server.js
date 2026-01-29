import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'

import healthRoute from './routes/health.js'
import unidadesRoute from './routes/unidades.js'
import produtosRoute from './routes/produtos.js'

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (origin.startsWith('chrome-extension://')) {
      return callback(null, true)
    }

    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000'
    ]

    if (allowed.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))


app.use(express.json())

app.use('/health', healthRoute)
app.use('/unidades', unidadesRoute)
app.use('/produtos', produtosRoute)

app.listen(env.port, () => {
  console.log(`°Api rodando na porta ${env.port}°`)
})
