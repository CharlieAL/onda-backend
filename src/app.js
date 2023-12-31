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
import socket from './sockets/socket.js'
// import { comprobarJWT } from './libs/jwt.js'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: ['https://onda-rust.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
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
    origin: ['https://onda-rust.vercel.app', 'http://localhost:5173']
  }
})

socket(io)

export default server
