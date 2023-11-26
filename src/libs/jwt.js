import jwt from 'jsonwebtoken'

export const creteAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      {
        expiresIn: '1d'
      },
      (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      }
    )
  })
}

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  })
}

export const comprobarJWT = (token = '') => {
  try {
    const { uid } = jwt.verify(token, process.env.TOKEN_SECRET)
    return [true, uid]
  } catch (error) {
    return [false, null]
  }
}
