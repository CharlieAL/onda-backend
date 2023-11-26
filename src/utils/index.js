export const isEmptyObj = (obj) => {
  if (obj === undefined || obj === null) {
    return true
  }

  return Object.keys(obj).length === 0
}

export const CleaningEmptyObj = (obj) => {
  for (var key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key]
    }
  }

  if (Object.keys(obj).length === 0) {
    obj = null
  }

  return obj
}

export const CheckRequiredAttributes = (
  required_attributes,
  obj,
  more_text = ''
) => {
  more_text = more_text === '' ? ' ' : ` ${more_text} `

  if (obj === null || obj === undefined) {
    throw new Error('Object is required')
  }

  // if required_attributes is string
  if (typeof required_attributes === 'string') {
    if (
      obj[required_attributes] === undefined ||
      obj[required_attributes] === null ||
      obj[required_attributes] === ''
    ) {
      throw new Error(`Attribute ${required_attributes}${more_text}is required`)
    }

    return
  }

  // if required_attributes is array
  if (Array.isArray(required_attributes)) {
    for (let key in required_attributes) {
      if (
        obj[required_attributes[key]] === undefined ||
        obj[required_attributes[key]] === null ||
        obj[required_attributes[key]] === ''
      ) {
        throw new Error(
          `Attribute ${required_attributes[key]}${more_text}is required`
        )
      }
    }

    return
  }

  // if required_attributes is object
  if (typeof required_attributes === 'object') {
    let count = 0
    let error_count = 0
    let error_msg = ''

    // iterate over object keys
    for (let key in required_attributes) {
      let error = false

      // iterate over array of keys
      for (let key2 in required_attributes[key]) {
        if (
          obj[required_attributes[key][key2]] === undefined ||
          obj[required_attributes[key][key2]] === null ||
          obj[required_attributes[key][key2]] === ''
        ) {
          error = true
          error_msg += `${required_attributes[key][key2]}, `
        }
      }

      count++

      if (error) {
        error_count++
      }

      // one case have not error
      if (error_count < count) {
        return
      }

      error_msg = error_msg.substring(0, error_msg.length - 2)
      error_msg += ` or `
    }

    error_msg = error_msg.substring(0, error_msg.length - 4)
    error_msg += `.`

    throw new Error(`Attribute ${error_msg}${more_text}is required`)
  }
}
