import pkg from 'pg';
import { env } from './config/env.js';

const { Pool } = pkg;
console.log({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  passwordLength: env.db.password?.length,
  password: env.db.password?.replace(/^"(.*)"$/, '$1').trim(),

  ssl: env.db.ssl,
})


export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password?.replace(/^"(.*)"$/, '$1').trim(),
  ssl: env.db.ssl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});


pool.on('connect', () => {
  console.log('✅ PostgreSQL conectado');
});

pool.on('error', (err) => {
  console.error('❌ Erro no PostgreSQL', err);
});
