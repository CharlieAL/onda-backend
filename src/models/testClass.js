import { pool } from '../db.js'

export class CharlyModel {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM Artists')
      return rows
    } catch (error) {
      console.error('Error UserModel.getAll():', error)
    }
  }
}
