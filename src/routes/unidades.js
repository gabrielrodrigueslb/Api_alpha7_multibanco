import {Router} from 'express';
import {pool} from '../db.js'

const router = Router();

/* GET /unidades
Lista unidades de negócio ativas */

router.get('/', async (req, res) => {
    try{
        const result = await pool.query(`
            SELECT id, codigo, nome, nomefantasia, estado, cidade FROM unidadenegocio WHERE status = 'A' ORDER BY nome
            `);

            res.json({total: result.rowCount,
                data:result.rows
            });
    } catch(error) {
        console.error('Erro ao buscar uniddes', error);
        res.status(500).json({error: 'Erro ao buscar unidades'})
        
    }
})


export default router