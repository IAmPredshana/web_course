const USERDB="postgres"
const PASSWORDDB="admin"
const HOSTDB="db"
const PORTDB=5432
const DATABASEDB="project_test_1"

import { Pool } from "pg"

const pool = new Pool({
    user: USERDB,
    host: HOSTDB,
    database: DATABASEDB,
    password: PASSWORDDB,
    port: PORTDB,
})

pool.on('error', (err) => {
  console.error('Неожиданная ошибка пула:', err)
})

const db = {
   query: (text, params) => pool.query(text, params)
}

export { db }