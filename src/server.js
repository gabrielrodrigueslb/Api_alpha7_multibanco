import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'

import healthRoute from './routes/health.js'
import unidadesRoute from './routes/unidades.js'
import produtosRoute from './routes/produtos.js'

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173', // Vite
    'http://localhost:3000', // se usar outro front
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use('/health', healthRoute)
app.use('/unidades', unidadesRoute)
app.use('/produtos', produtosRoute)

app.listen(env.port, () => {
  console.log(`°Api rodando na porta ${env.port}°`)
})
