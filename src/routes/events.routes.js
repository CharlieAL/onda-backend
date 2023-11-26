import { Router } from 'express'
import { EventModel } from '../models/Event.js'
import { createEvent } from '../controllers/events.js'
import { authRequired } from '../middlewares/validateToken.js'
import { canCreateEvent } from '../middlewares/canCreateEvent.js'

const router = Router()

router.get('/', authRequired, async (req, res) => {
  // Tu código de controlador aquí
  try {
    const { user_id: userId } = req.user
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const city = req.query.city || null

    const data = await EventModel.getEventsPorPage(page, limit, city, userId)

    const totalEvents = await EventModel.countEvents(city)

    const totalPage = Math.ceil(totalEvents / limit)
    const result = {
      data,
      city: city || 'all',
      page,
      totalPage
    }
    res.json(result)
  } catch (error) {
    console.error('Error EventModel.getAll():', error)
    res.status(500).json({ message: 'Error al obtener los eventos' })
  }
})

router.get('/get-one/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params
    const result = await EventModel.getById(id)
    res.json(result)
  } catch (error) {
    console.error('Error EventModel.getById():', error)
    res.status(500).json({ message: 'Error al obtener el evento' })
  }
})

router.post('/', authRequired, canCreateEvent, createEvent)

router.post('/asistir-evento', authRequired, async (req, res) => {
  try {
    const { eventId, boletos } = req.body
    const { user_id: userId } = req.user

    const result = await EventModel.asistirEvento(eventId, userId, boletos)

    res.json(result)
  } catch (error) {
    console.error('Error EventModel.asistirEvento():', error)
    res.status(500).json({ message: 'Error al asistir al evento' })
  }
})

router.post('/like/:id', authRequired, async (req, res) => {
  try {
    const { id: eventId } = req.params
    const { user_id: userId } = req.user

    const result = await EventModel.postLike(eventId, userId)

    res.json(result)
  } catch (error) {
    console.error('Error EventModel.like():', error)
    res.status(500).json({ message: 'Error al dar like al evento' })
  }
})

router.delete('/like/:id', authRequired, async (req, res) => {
  try {
    const { id: eventId } = req.params
    const { user_id: userId } = req.user

    const result = await EventModel.deleteLike(eventId, userId)

    res.json(result)
  } catch (error) {
    console.error('Error EventModel.like():', error)
    res.status(500).json({ message: 'Error al dar like al evento' })
  }
})

router.post('/comment/:id', authRequired, async (req, res) => {
  try {
    const { id: eventId } = req.params
    const { user_id: userId } = req.user
    const { comment } = req.body

    console.log(
      '🚀 ~ file: events.routes.js ~ line 134 ~ router.post ~ comment',
      comment,
      eventId
    )

    const result = await EventModel.createComment(eventId, userId, comment)

    res.json(result)
  } catch (error) {
    console.error('Error EventModel.createComment():', error)
    res.status(500).json({ message: 'Error al comentar el evento' })
  }
})

router.get('/comment/:id', authRequired, async (req, res) => {
  try {
    const { id: eventId } = req.params

    const result = await EventModel.getComments(eventId)

    res.json(result)
  } catch (error) {
    console.error('Error EventModel.getComments():', error)
    res.status(500).json({ message: 'Error al obtener los comentarios' })
  }
})

router.get('/my-like-events', authRequired, async (req, res) => {
  try {
    const id = req.user.user_id
    const result = await EventModel.getUserLikeEvents(id)
    console.log(result)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/my-tickets', authRequired, async (req, res) => {
  try {
    const id = req.user.user_id
    const result = await EventModel.getUserTickets(id)
    console.log(result)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
