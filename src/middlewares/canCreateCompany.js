import { UserModel } from '../models/User.js'

export const canCreateCompany = async (req, res, next) => {
  const { user } = req
  const can = await UserModel.isUserCompanyOrAdmin(user)
  if (!can) {
    return res
      .status(403)
      .json({ error: 'el usuario no puede hacer una empresa' })
  }
  next()
}
