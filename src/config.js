export const configDb = {
  host: process.env.HOST_DB || 'localhost',
  user: 'admin',
  port: 3306,
  password: process.env.PASSWORD_DB || '',
  database: 'onda_db'
}
