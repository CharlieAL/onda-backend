import { UserModel } from '../models/User.js'

const socket = (io) => {
  io.on('connection', (client) => {
    const uid = client.handshake.query.uid
    console.log('Cliente conectado' + uid)

    // Verificar autenticación
    if (uid === 'undefined') {
      console.log('cliente no autenticado')
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
      const { de, para, mensaje } = payload
      await UserModel.saveMessage({ de, para, mensaje })
      console.log(payload)
      io.to(payload.para).emit('mensaje-personal', payload)
    })

    client.on('disconnect', () => {
      //  userDisconnected(uid)
      console.log('Cliente desconectado')
    })
  })
}

export default socket
