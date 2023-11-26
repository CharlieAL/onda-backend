import { EventModel } from '../models/Event.js'
import { CompanyModel } from '../models/Company.js'

export const createEvent = async (req, res) => {
  try {
    const user = req.user
    const rows = await CompanyModel.getCompanyByUser(user.user_id)
    const newEvent = req.body
    newEvent.company_id = rows[0].company_id
    const id = await EventModel.create(newEvent)
    console.log('???????')
    res.json({ id })
  } catch (error) {
    console.error('Error EventModel.create():', error)
    res.status(500).json({ message: 'Error al crear el evento' })
  }
}
