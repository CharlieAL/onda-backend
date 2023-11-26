import { pool } from '../db.js'
import { createQuerySql } from '../utils/create-sql.js'

export class EventModel {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM events')
      return rows
    } catch (error) {
      console.error('Error EventModel.getAll():', error)
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM events WHERE event_id = ?',
        [id]
      )
      return rows[0]
    } catch (error) {
      console.error('Error EventModel.getById():', error)
    }
  }

  static async getEventsPorPage(page, limit, city, userId) {
    try {
      const offset = (page - 1) * limit

      if (city !== null) {
        const cityLower = city.toLowerCase()

        const [events] = await pool.query(
          'SELECT events.*, CASE WHEN likes_event.likes_id IS NOT NULL THEN 1 ELSE 0 END AS liked_by_user FROM events LEFT JOIN (SELECT likes_event.*, events.city FROM likes_event INNER JOIN events ON likes_event.event_id = events.event_id WHERE LOWER(events.city) = LOWER(?)) AS likes_event ON events.event_id = likes_event.event_id AND likes_event.user_id = ? ORDER BY events.create_at DESC LIMIT ? OFFSET ?;',
          [cityLower, userId, limit, offset]
        )
        return events
      }
      const [events] = await pool.query(
        'SELECT events.*, CASE WHEN likes_event.likes_id IS NOT NULL THEN 1 ELSE 0 END AS liked_by_user FROM events LEFT JOIN (SELECT likes_event.*, events.city FROM likes_event INNER JOIN events ON likes_event.event_id = events.event_id) AS likes_event ON events.event_id = likes_event.event_id AND likes_event.user_id = ? ORDER BY events.create_at DESC LIMIT ? OFFSET ?;',
        [userId, limit, offset]
      )
      return events
    } catch (error) {
      console.error('Error EventModel.getEventsPorPage():', error)
      throw new Error(error.sqlMessage || 'Error getting events by page')
    }
  }

  static async countEvents(city) {
    try {
      if (city !== null) {
        const cityLower = city.toLowerCase()
        const [rows] = await pool.query(
          'SELECT COUNT(*) as total FROM events WHERE LOWER(city) LIKE ?',
          [cityLower]
        )
        return rows[0].total
      }
      const [rows] = await pool.query('SELECT COUNT(*) as total FROM events')
      return rows[0].total
    } catch (error) {
      console.error('Error EventModel.countEvents():', error)
      throw new Error(error.sqlMessage || 'Error counting events')
    }
  }

  static async create(event) {
    try {
      const { sql, values } = createQuerySql('events', event)
      console.log(sql, values)
      const [result] = await pool.query(sql, values)

      return result.insertId
    } catch (error) {
      console.error('Error EventModel.create():', error)
      throw new Error(error.sqlMessage || 'Error creating event')
    }
  }

  static async asistirEvento(eventId, userId, boletos) {
    try {
      const [result] = await pool.query(
        'INSERT INTO user_event (event_id, user_id, boletos) VALUES (?, ?, ?)',
        [eventId, userId, boletos]
      )

      return result
    } catch (error) {
      console.error('Error EventModel.asistirEvento():', error)
      throw new Error(error.sqlMessage || 'Error asistiendo al evento')
    }
  }

  static async postLike(eventId, userId) {
    try {
      const [result] = await pool.query(
        'INSERT INTO likes_event (event_id, user_id) VALUES (?, ?)',
        [eventId, userId]
      )

      return result
    } catch (error) {
      console.error('Error EventModel.postLikeEvent():', error)
      throw new Error(error.sqlMessage || 'Error dando like al evento')
    }
  }

  static async deleteLike(eventId, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM likes_event WHERE event_id = ? AND user_id = ?',
        [eventId, userId]
      )
      return result
    } catch (error) {
      console.error('Error EventModel.deleteLikeEvent():', error)
      throw new Error(error.sqlMessage || 'Error quitando like al evento')
    }
  }

  static async createComment(idEvent, idUser, comment) {
    try {
      const [result] = await pool.query(
        'INSERT INTO event_comments (event_id, user_id, comment) VALUES (?, ?, ?)',
        [idEvent, idUser, comment]
      )
      return result
    } catch (error) {
      console.error('Error EventModel.createComment():', error)
      throw new Error(error.sqlMessage || 'Error comentando el evento')
    }
  }

  static async getComments(idEvent) {
    try {
      const [result] = await pool.query(
        'SELECT event_comments.*, users.user_handle, users.avatar_url FROM event_comments INNER JOIN users ON event_comments.user_id = users.user_id WHERE event_id = ? ORDER BY event_comments.create_at DESC',
        [idEvent]
      )
      return result
    } catch (error) {
      console.error('Error EventModel.getComments():', error)
      throw new Error(error.sqlMessage || 'Error obteniendo los comentarios')
    }
  }

  static async getUserLikeEvents(userId) {
    try {
      const [result] = await pool.query(
        'SELECT likes_event.*, events.* FROM likes_event INNER JOIN events ON likes_event.event_id = events.event_id WHERE likes_event.user_id = 1;',
        [userId]
      )
      return result
    } catch (error) {
      console.error('Error EventModel.getEvnetsByUserLiked():', error)
      throw new Error(
        error.sqlMessage || 'Error obteniendo los eventos por usuario'
      )
    }
  }

  static async getUserTickets(userId) {
    try {
      const [result] = await pool.query(
        'SELECT user_event.*, events.* FROM user_event INNER JOIN events ON user_event.event_id = events.event_id WHERE user_event.user_id = ?;',
        [userId]
      )
      return result
    } catch (error) {
      console.error('Error EventModel.getEvnetsByUserLiked():', error)
      throw new Error(
        error.sqlMessage || 'Error obteniendo los eventos por usuario'
      )
    }
  }
}
