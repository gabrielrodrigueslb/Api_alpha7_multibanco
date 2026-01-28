import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

router.get('/:unidadeId', async (req, res) => {
  const { unidadeId } = req.params
  const page = Math.max(Number(req.query.page ?? 1), 1)
  const limit = Math.min(Number(req.query.limit ?? 50), 2000)
  const offset = (page - 1) * limit

  try {
    // 🔢 Total de produtos com estoque
    const totalResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM estoque e
      WHERE e.unidadenegocioid = $1
        AND e.estoque > 0
      `,
      [unidadeId]
    )

    const total = Number(totalResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)

    // 📦 Produtos + preços
    const { rows } = await pool.query(
      `
      SELECT
        emb.id AS produto_id,
        p.descricao AS produto,
        e.estoque::float AS quantidade,

        -- preço base (loja > geral)
        COALESCE(
          peu.precovenda,
          emb.precovenda
        )::numeric AS preco_venda,

        -- preço promocional (se existir)
        mo.precooferta::numeric AS preco_promocional,

        -- preço final (promo > loja > geral)
        CASE
          WHEN mo.precooferta IS NOT NULL THEN mo.precooferta
          WHEN peu.precovenda IS NOT NULL THEN peu.precovenda
          ELSE emb.precovenda
        END::numeric AS preco_final

      FROM estoque e
      JOIN embalagem emb ON emb.id = e.embalagemid
      JOIN produto p ON p.id = emb.produtoid

      LEFT JOIN precoembalagemunidadenegocio peu
        ON peu.embalagemid = emb.id
       AND peu.unidadenegocioid = e.unidadenegocioid

      LEFT JOIN melhoroferta mo
        ON mo.embalagemid = emb.id
       AND mo.unidadenegocioid = e.unidadenegocioid
       AND (mo.vigenciainicio IS NULL OR mo.vigenciainicio <= NOW())
       AND (mo.vigenciatermino IS NULL OR mo.vigenciatermino >= NOW())

      WHERE e.unidadenegocioid = $1
        AND e.estoque > 0

      ORDER BY p.descricao
      LIMIT $2 OFFSET $3
      `,
      [unidadeId, limit, offset]
    )

    // 🧾 Resposta final (enxuta)
    res.json({
      unidadeId,
      page,
      limit,
      total,
      totalPages,
      data: rows.map(r => ({
        produto_id: r.produto_id,
        produto: r.produto,
        quantidade: r.quantidade,
        preco_venda: r.preco_venda !== null ? Number(r.preco_venda) : null,
        preco_promocional: r.preco_promocional !== null ? Number(r.preco_promocional) : null,
        preco_final: r.preco_final !== null ? Number(r.preco_final) : null
      }))
    })
  } catch (err) {
    console.error('Erro produtos:', err)
    res.status(500).json({ error: 'Erro ao buscar produtos da unidade' })
  }
})

export default router
