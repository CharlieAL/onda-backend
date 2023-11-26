import { Router } from 'express'

import { authRequired } from '../middlewares/validateToken.js'
import { canCreateCompany } from '../middlewares/canCreateCompany.js'
import { createCompany } from '../controllers/company.js'
import { CompanyModel } from '../models/Company.js'

const router = Router()

router.get('/', authRequired, async (req, res) => {
  try {
    const result = await CompanyModel.getAll()
    res.json(result)
  } catch (error) {
    console.error('Error Company.getAll():', error)
    res.status(500).json({ message: 'Error al obtener las empresas' })
  }
})

router.post('/', authRequired, canCreateCompany, createCompany)

export default router
