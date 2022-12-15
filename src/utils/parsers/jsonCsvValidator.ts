import Joi from 'joi'

import { JsonCsv } from '../../../@types/common'

/**
 * Validates that the given data argument consists of an array of objects whose keys match the
 * provided header array
 */
export default (data: unknown, columns: Array<string>): data is JsonCsv => {
  const cell = Joi.string().required()
  const keys = columns.reduce((acc, current) => {
    acc[current] = cell
    return acc
  }, {} as any)
  const row = Joi.object().keys(keys)
  const schema = Joi.array().items(row)
  const { error } = schema.validate(data)
  return error === undefined
}
