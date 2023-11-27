import { Router } from 'express'
import { UserModel } from '../models/User.js'
import {
  givePermissionByCreateCompany,
  removePermissionByCreateCompany,
  sendFriendRequest,
  signin,
  signout,
  signup
} from '../controllers/auth.js'
import { authRequired } from '../middlewares/validateToken.js'
import { verifyToken } from '../libs/jwt.js'

const router = Router()

router.get('/', authRequired, async (req, res) => {
  try {
    const { user_id: userId } = req.user
    const result = await UserModel.getAll(userId)
    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/get-one/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params
    const result = await UserModel.getById(id)
    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})

router.put('/update/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params
    const user = req.body
    await UserModel.updateById(id, user)
    res.json({ message: 'User updated successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/verify-token', async (req, res) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ error: 'Token is required' })
  }
  try {
    const payload = await verifyToken(token)
    req.user = payload
    res.json({ message: 'Token is valid', payload })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
})

router.post('/signin', signin)

router.post('/signup', signup)

router.post('/signout', authRequired, signout)

router.put(
  '/give-permission-by-create-company/:idUser',
  authRequired,
  givePermissionByCreateCompany
)
router.put(
  '/remove-permission-by-create-company/:idUser',
  authRequired,
  removePermissionByCreateCompany
)

router.post('/send-friend-request/:id', authRequired, sendFriendRequest)

router.get('/friends', authRequired, async (req, res) => {
  try {
    const id = req.user.user_id
    const data = await UserModel.getFriends(id)
    if (data.length === 0) {
      return res.json([])
    }
    const friendIDs = []
    data.map((item) =>
      item.reciver_user_id === id
        ? friendIDs.push(item.sender_user_id)
        : friendIDs.push(item.reciver_user_id)
    )
    const result = await UserModel.getFriendsById(friendIDs)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get(
  '/get-pending-friends-request/:option',
  authRequired,
  async (req, res) => {
    const { option } = req.params
    const id = req.user.user_id
    try {
      if (option === 'sender') {
        const result = await UserModel.getMySendingPendingFriendsRequest(id)
        return res.json(result)
      } else if (option === 'reciver') {
        const result = await UserModel.getMyPendingFriendsRequest(id)
        return res.json(result)
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

router.put('/accept-friend-request/:id', authRequired, async (req, res) => {
  const { id } = req.params
  try {
    const idUserReciver = req.user.user_id
    const idUserSender = id
    await UserModel.friendsRequestAcceptOrRejected(
      idUserReciver,
      idUserSender,
      'accepted'
    )
    res.json({ message: 'Friend request accepted' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.put('/reject-friend-request/:id', authRequired, async (req, res) => {
  const { id } = req.params
  try {
    const idUserReciver = req.user.user_id
    const idUserSender = id
    await UserModel.friendsRequestAcceptOrRejected(
      idUserReciver,
      idUserSender,
      'rejected'
    )
    res.json({ message: 'Friend request rejected' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/messages/:friend', authRequired, async (req, res) => {
  try {
    const { user_id: userId } = req.user
    const { friend } = req.params
    const result = await UserModel.getMessages(userId, friend)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/permissions', authRequired, async (req, res) => {
  try {
    const { role } = req.user
    if (role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const result = await UserModel.getAllPermissions()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/permissions/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params
    await UserModel.createPermission(id)
    res.json({ message: 'Permission created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
