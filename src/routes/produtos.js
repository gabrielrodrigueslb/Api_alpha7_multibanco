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
        p.id        AS produto_id,
        p.codigo    AS produto_codigo,
        p.descricao AS produto_descricao,

        e.id        AS estoque_id,
        e.estoque   AS estoque,

        emb.id          AS embalagem_id,
        emb.descricao   AS embalagem_descricao,
        emb.quantidade  AS embalagem_quantidade
      FROM estoque e
      JOIN embalagem emb ON emb.id = e.embalagemid
      JOIN produto p     ON p.id = emb.produtoid
      WHERE e.unidadenegocioid = $1
        AND e.estoque <> 0
        AND p.status = 'A'
      ORDER BY p.descricao
      LIMIT $2 OFFSET $3
      `,
      [unidadeId, limit, offset]
    )

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
