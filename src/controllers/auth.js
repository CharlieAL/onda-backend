import { UserModel } from '../models/User.js'

import { CheckRequiredAttributes, CleaningEmptyObj } from '../utils/index.js'
import bcrypt from 'bcryptjs'
import { creteAccessToken } from '../libs/jwt.js'

export const signup = async (req, res) => {
  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    user_handle: req.body.user_handle,
    phone_number: req.body.phone_number,
    birth: req.body.birth,
    avatar_url: req.body.avatar_url,
    password: req.body.password,
    role: req.body.role || 'normal'
  }
  const requiredAttributes = [
    'first_name',
    'last_name',
    'user_handle',
    'password'
  ]
  const checkedUser = CleaningEmptyObj(newUser)

  try {
    CheckRequiredAttributes(requiredAttributes, checkedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }

  try {
    const passwordHash = await bcrypt.hash(checkedUser.password, 10)
    checkedUser.password = passwordHash
    const id = await UserModel.create(checkedUser)
    const payload = {
      user_id: id,
      user_handle: checkedUser.user_handle,
      avatar_url: checkedUser.avatar_url,
      role: checkedUser.role
    }
    const token = await creteAccessToken(payload)
    res.cookie('token', token)

    res.status(201).json({ payload, message: 'User created successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const signin = async (req, res) => {
  const user = {
    user_handle: req.body.user_handle,
    password: req.body.password
  }
  const requiredAttributes = ['user_handle', 'password']
  const checkedUser = CleaningEmptyObj(user)

  try {
    CheckRequiredAttributes(requiredAttributes, checkedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }

  try {
    const userFromDB = await UserModel.getByUserHandle(checkedUser.user_handle)
    // const passwordHash = await bcrypt.hash(checkedUser.password, 10)

    if (!userFromDB) {
      return res.status(400).json({ error: 'Credentials are incorrect' })
    }

    const validPassword = await bcrypt.compare(
      checkedUser.password,
      userFromDB.password
    )

    if (!validPassword) {
      return res.status(400).json({ error: 'Credentials are incorrect' })
    }
    // checkedUser.password = passwordHash
    const payload = {
      user_id: userFromDB.user_id,
      user_handle: userFromDB.user_handle,
      avatar_url: userFromDB.avatar_url,
      role: userFromDB.role
    }
    const token = await creteAccessToken(payload)
    res.cookie('token', token, { httpOnly: true })
    res.status(201).json({ payload, message: 'User logged successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message.toString() })
  }
}

export const signout = async (req, res) => {
  console.log(req.user)
  res.clearCookie('token')
  res.status(200).json({ message: 'User logged out successfully' })
}

export const givePermissionByCreateCompany = async (req, res) => {
  try {
    const user = req.user
    const isAdmin = await UserModel.isUserAdmin(user.user_id)

    if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })

    const { idUser } = req.params
    await UserModel.givePermissionByCreateCompany(idUser)
    res.json({ message: 'Permission granted' })
  } catch (error) {
    console.error(
      'Error router.patch(/give-permission-by-create-company/:idUser):',
      error
    )
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const removePermissionByCreateCompany = async (req, res) => {
  try {
    const user = req.user
    const isAdmin = await UserModel.isUserAdmin(user.user_id)

    if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })

    const { idUser } = req.params
    await UserModel.removePermissionByCreateCompany(idUser)
    res.json({ message: 'Permission granted' })
  } catch (error) {
    console.error(
      'Error router.patch(/remove-permission-by-create-company/:idUser):',
      error
    )
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const sendFriendRequest = async (req, res) => {
  const userIdReciver = req.params.id
  const userIdSender = req.user.user_id

  try {
    await UserModel.friendsRequest(userIdReciver, userIdSender)

    res.json({ message: 'Friend request sent' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error sending friend request' })
  }
}
