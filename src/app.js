import express from 'express'

import http from 'http'
import { Server as SocketServer } from 'socket.io'

import morgan from 'morgan'

import usersRouter from './routes/users.routes.js'
import eventsRouter from './routes/events.routes.js'
import companiesRouter from './routes/companies.routes.js'

import cookieParser from 'cookie-parser'

import cors from 'cors'

import dotenv from 'dotenv'
import { comprobarJWT } from './libs/jwt.js'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    credentials: true
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/users', usersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/company', companiesRouter)

const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

io.on('connection', (client) => {
  console.log('Cliente conectado')
  const uid = client.handshake.query.uid
  console.log(uid)

  // Verificar autenticación
  if (!uid) {
    return client.disconnect()
  }

  // Cliente autenticado
  //  userConnected(uid)

  // Ingresar al usuario a una sala en particular
  // sala global, client.id, 5f298534ad4169714548b785
  client.join(uid)

  // Escuchar del cliente el mensaje-personal
  client.on('mensaje-personal', async (payload) => {
    // TODO: Grabar mensaje
    //  await saveMessage(payload)
    console.log(payload)
    io.to(payload.para).emit('mensaje-personal', payload)
  })

  client.on('disconnect', () => {
    //  userDisconnected(uid)
  })
})

export default server
