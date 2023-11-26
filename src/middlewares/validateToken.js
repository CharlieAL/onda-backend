import { verifyToken } from '../libs/jwt.js'

export const authRequired = async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ error: 'Token is required' })
  }
  try {
    const payload = await verifyToken(token)
    req.user = payload
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  next()
}
