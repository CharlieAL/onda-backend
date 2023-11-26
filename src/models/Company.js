import { pool } from '../db.js'
import { createQuerySql } from '../utils/create-sql.js'

export class CompanyModel {
  static async create(company) {
    try {
      const { sql, values } = createQuerySql('company', company)
      const [newCompany] = await pool.query(sql, values)
      return newCompany.insertId
    } catch (error) {
      console.error('Error Company.create():', error.sqlMessage || error)
      throw new Error(error.sqlMessage || 'Error creating company')
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM company')
      return rows
    } catch (error) {
      console.error('Error Company.getAll():', error)
    }
  }

  static async getCompanyByUser(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM company WHERE user_id = ?',
        [userId]
      )
      return rows
    } catch (error) {
      console.error('Error Company.getAll():', error)
    }
  }
}
