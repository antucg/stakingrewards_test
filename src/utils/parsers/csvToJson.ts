import csvToJson from 'csvtojson'

/**
 * Given a CSV string and an array of headers, parse the string, formatting it as objects whose
 * keys are the ones from the headers
 */
export default (csv: string, headers: Array<string>) =>
  csvToJson({ headers, noheader: true }).fromString(csv)
