import { createPool } from 'mysql2/promise'
import { configDb } from './config.js'
let pool
try {
  pool = await createPool(configDb)
  console.log('Database connection successful')
} catch (error) {
  console.error('Database connection error:', error)
}
export { pool }
