import { CompanyModel } from '../models/Company.js'
import { CheckRequiredAttributes, CleaningEmptyObj } from '../utils/index.js'

export const createCompany = async (req, res) => {
  const newCompany = {
    user_id: req.user.user_id,
    name_company: req.body.name_company,
    phone_number: req.body.phone_number,
    description: req.body.description,
    timetables: req.body.timetables,
    email: req.body.email,
    image_url_1: req.body.image_url_1,
    image_url_2: req.body.image_url_2,
    image_url_3: req.body.image_url_3,
    image_url_4: req.body.image_url_4,
    location: req.body.location,
    status: req.body.status
  }
  const requiredAttributes = [
    'user_id',
    'name_company',
    'phone_number',
    'email',
    'location'
  ]
  const checkedCompany = CleaningEmptyObj(newCompany)
  try {
    CheckRequiredAttributes(requiredAttributes, checkedCompany)
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }
  try {
    await CompanyModel.create(checkedCompany)
    res.status(201).json({ message: 'Company created' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
