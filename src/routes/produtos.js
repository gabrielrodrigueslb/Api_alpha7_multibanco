import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

router.get('/:unidadeId', async (req, res) => {
  const { unidadeId } = req.params
  const page = Number(req.query.page ?? 1)
  const limit = Number(req.query.limit ?? 50)
  const offset = (page - 1) * limit

  try {
    const { rows } = await pool.query(
  `
  SELECT
    p.id AS produto_id,
    p.descricao AS produto,
    e.estoque AS quantidade
  FROM estoque e
  JOIN embalagem emb ON emb.id = e.embalagemid
  JOIN produto p ON p.id = emb.produtoid
  WHERE e.unidadenegocioid = $1
    AND e.estoque > 0
  ORDER BY p.descricao
  `,
  [req.params.unidadeId]
);


    res.json({
      unidadeId,
      page,
      limit,
      total: rows.length,
      data: rows
    })
  } catch (err) {
    console.error('Erro produtos:', err)
    res.status(500).json({ error: 'Erro ao buscar produtos da unidade' })
  }
})

export default router
