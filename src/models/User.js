import { pool } from '../db.js'
import { createQuerySql, updateQuerySql } from '../utils/create-sql.js'

export class UserModel {
  static async getAll(userId) {
    try {
      const [rows] = await pool.query(
        "SELECT u.user_id, u.first_name, u.last_name, u.user_handle, u.avatar_url, CASE WHEN f.status = 'pending' AND f.sender_user_id = ? THEN 'pendiente' WHEN f.status = 'pending' AND f.reciver_user_id = ? THEN 'aceptar' WHEN f.status IS NULL THEN 'enviar' ELSE 'amigos' END AS friend_status FROM users u LEFT JOIN friends f ON (u.user_id = f.sender_user_id OR u.user_id = f.reciver_user_id) AND (f.sender_user_id = ? OR f.reciver_user_id = ?) WHERE u.user_id != ?;",
        [userId, userId, userId, userId, userId]
      )
      return rows
    } catch (error) {
      console.error('Error UserModel.getAll():', error)
    }
  }

  static async create(user) {
    try {
      const { sql, values } = createQuerySql('users', user)
      const [newUser] = await pool.query(sql, values)
      return newUser.insertId
    } catch (error) {
      console.error('Error UserModel.create():', error.sqlMessage || error)
      throw new Error(error.sqlMessage || 'Error creating user')
    }
  }

  static async getByUserHandle(userHandle) {
    try {
      const [user] = await pool.query(
        'SELECT * FROM users WHERE user_handle = ?',
        [userHandle]
      )
      return user[0]
    } catch (error) {
      console.error('Error UserModel.getByUserHandle():', error)
    }
  }

  static async getById(id) {
    try {
      const [user] = await pool.query('SELECT * FROM users WHERE user_id = ?', [
        id
      ])
      return user[0]
    } catch (error) {
      console.error('Error UserModel.getById():', error)
    }
  }

  static async updateById(id, user) {
    try {
      const { sql, values } = updateQuerySql('users', user, 'user_id = ?')
      const [result] = await pool.query(sql, [...values, id])
      return result
    } catch (error) {
      console.error('Error UserModel.updateById():', error)
    }
  }

  static async givePermissionByCreateCompany(idUser) {
    try {
      await pool.query('UPDATE users SET role = "company" WHERE user_id = ?', [
        idUser
      ])
    } catch (error) {
      console.error('Error UserModel.givePermissionByCreateCompany():', error)
    }
  }

  static async removePermissionByCreateCompany(idUser) {
    try {
      await pool.query('UPDATE users SET role = "normal" WHERE user_id = ?', [
        idUser
      ])
    } catch (error) {
      console.error('Error UserModel.removePermissionByCreateCompany():', error)
    }
  }

  static async isUserAdmin(idUser) {
    try {
      const [user] = await pool.query(
        'SELECT role FROM users WHERE user_id = ?',
        [idUser]
      )
      return user[0].role === 'admin'
    } catch (error) {
      console.error('Error UserModel.isUserAdmin():', error)
    }
  }

  static async isUserCompanyOrAdmin(user) {
    // TODO: Buscar si ya tiene otra compania
    return user.role === 'company' || user.role === 'admin'
  }

  static async isUserCompany(user) {
    return user.role === 'company' || user.role === 'admin'
  }

  static async friendsRequest(idUserReciver, idUserSender) {
    try {
      await pool.query(
        'INSERT INTO friends (reciver_user_id, sender_user_id) VALUES (?, ?)',
        [idUserReciver, idUserSender]
      )
    } catch (error) {
      console.error('Error UserModel.friendsRequest():', error)
      throw new Error(error.sqlMessage || 'Error creating user')
    }
  }

  static async friendsRequestAcceptOrRejected(
    idUserReciver,
    idUserSender,
    status = 'accepted'
  ) {
    try {
      await pool.query(
        'UPDATE friends SET status = ? WHERE reciver_user_id = ? AND sender_user_id = ?',
        [status, idUserReciver, idUserSender]
      )
    } catch (error) {
      console.error('Error UserModel.friendsRequestAccept():', error)
    }
  }

  static async getMyPendingFriendsRequest(idUser) {
    try {
      const [friends] = await pool.query(
        'SELECT u.user_id AS friend_user_id, u.first_name AS friend_first_name, u.last_name AS friend_last_name, u.email AS friend_email, u.user_handle AS friend_user_handle, u.avatar_url FROM friends AS f INNER JOIN users AS u ON f.sender_user_id = u.user_id WHERE f.reciver_user_id = ? AND f.status = "pending";',
        [idUser]
      )
      return friends
    } catch (error) {
      console.error('Error UserModel.getMyPendingFriendsRequest():', error)
    }
  }

  static async getMySendingPendingFriendsRequest(idUser) {
    try {
      const [friends] = await pool.query(
        'SELECT status, u.user_id AS friend_user_id, u.first_name AS friend_first_name, u.last_name AS friend_last_name, u.email AS friend_email, u.user_handle AS friend_user_handle, u.avatar_url FROM friends AS f INNER JOIN users AS u ON f.reciver_user_id = u.user_id WHERE f.sender_user_id = ? AND f.status = "pending";',
        [idUser]
      )
      return friends
    } catch (error) {
      console.error('Error UserModel.getMyPendingFriendsRequest():', error)
    }
  }

  static async getFriends(idUser) {
    try {
      const [friends] = await pool.query(
        'SELECT * FROM friends WHERE (reciver_user_id = ? OR sender_user_id = ?) AND status = "accepted"',
        [idUser, idUser]
      )
      return friends
    } catch (error) {
      console.error('Error UserModel.getMyFriends():', error)
    }
  }

  static async getFriendsById(userIds) {
    try {
      const [friends] = await pool.query(
        'SELECT * FROM users WHERE user_id IN (?)',
        [userIds]
      )
      return friends
    } catch (error) {
      console.error('Error UserModel.getMyFriends():', error)
    }
  }
}
