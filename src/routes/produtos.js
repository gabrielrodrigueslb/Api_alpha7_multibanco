import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

router.get('/:unidadeId', async (req, res) => {
  const { unidadeId } = req.params
  const page = Math.max(Number(req.query.page ?? 1), 1)
  const limit = Math.min(Number(req.query.limit ?? 50), 100)
  const offset = (page - 1) * limit

  try {
    const totalResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM estoque e
      JOIN embalagem emb ON emb.id = e.embalagemid
      JOIN produto p ON p.id = emb.produtoid
      WHERE e.unidadenegocioid = $1
        AND e.estoque > 0
      `,
      [unidadeId]
    )

    const total = Number(totalResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)

    const { rows } = await pool.query(
      `
      SELECT
        p.id AS produto_id,
        p.descricao AS produto,
        e.estoque::float AS quantidade
      FROM estoque e
      JOIN embalagem emb ON emb.id = e.embalagemid
      JOIN produto p ON p.id = emb.produtoid
      WHERE e.unidadenegocioid = $1
        AND e.estoque > 0
      ORDER BY p.descricao
      LIMIT $2 OFFSET $3
      `,
      [unidadeId, limit, offset]
    )

    res.json({
      unidadeId,
      page,
      limit,
      total,
      totalPages,
      data: rows
    })
  } catch (err) {
    console.error('Erro produtos:', err)
    res.status(500).json({ error: 'Erro ao buscar produtos da unidade' })
  }
})

export default router
