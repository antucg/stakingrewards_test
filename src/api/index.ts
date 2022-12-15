import csvToJson from '../utils/parsers/csvToJson'
import csvData from './fakeCSVData.json'
import httpClient from './httpClient'

/**
 * Read mock data from json, and returns it as a JSON object.
 */
export const getCSVData = (headers: Array<string>) => csvToJson(csvData.csv, headers)

/**
 * Given a CSV file as a string, calls the server to save its changes.
 */
export const saveCSV = (data: string) => httpClient.post('/save', { data })

/**
 * Given an id, checks with the server the status of the save operation.
 */
export const getStatus = (id: string) => httpClient.get(`/get-status?id=${id}`)
