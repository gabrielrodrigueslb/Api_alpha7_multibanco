import express from 'express'
import {env} from './config/env.js'
import healthRoute from './routes/health.js'
import unidadesRoute from './routes/unidades.js'
import produtosRoute from './routes/produtos.js'

const app = express()

app.use(express.json())

app.use('/health', healthRoute);
app.use('/unidades', unidadesRoute)
app.use('/produtos', produtosRoute)

console.log('PWD LEN:', process.env.DB_PASSWORD.length)


app.listen(env.port, () => {
    console.log(`°Api rodando na porta ${env.port}°`)
})