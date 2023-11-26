export const createQuerySql = (name, obj) => {
  const columnNames = Object.keys(obj)
  const columnValues = columnNames.map((columnName) => obj[columnName])
  const questionMarks = columnValues.map(() => '?').join(', ')
  const sql = `INSERT INTO ${name} (${columnNames.join(
    ', '
  )}) VALUES (${questionMarks})`
  return { sql, values: columnValues }
}

export const updateQuerySql = (name, obj, condition) => {
  const columnNames = Object.keys(obj)
  const columnValues = columnNames.map((columnName) => obj[columnName])
  const setValues = columnNames
    .map((columnName) => `${columnName} = ?`)
    .join(', ')
  const sql = `UPDATE ${name} SET ${setValues} WHERE ${condition}`
  return { sql, values: [...columnValues] }
}
