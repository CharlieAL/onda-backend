import { UserModel } from '../models/User.js'

export const canCreateEvent = async (req, res, next) => {
  const { user } = req
  const canCreateEvent = await UserModel.isUserCompany(user)
  if (!canCreateEvent) {
    return res.status(403).json({ error: 'el usuario no puede crear evento' })
  }
  next()
}
