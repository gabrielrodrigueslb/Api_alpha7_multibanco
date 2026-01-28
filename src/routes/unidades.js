import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

/* GET /unidades
   Lista unidades de negócio ativas QUE POSSUEM ESTOQUE */

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.codigo, u.nome, u.nomefantasia, u.estado, u.cidade 
            FROM unidadenegocio u 
            WHERE u.status = 'A' 
            AND EXISTS (
                SELECT 1 
                FROM estoque e 
                WHERE e.unidadenegocioid = u.id 
                AND e.estoque > 0
            )
            ORDER BY u.nome
        `);

        res.json({
            total: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar unidades:', error);
        res.status(500).json({ error: 'Erro ao buscar unidades' });
    }
});

export default router;