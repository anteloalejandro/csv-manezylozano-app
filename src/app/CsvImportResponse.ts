export type CsvWarning = {
  dataType: string,
  ref: string,
  message: string
}

export type CsvImportResponse = {
  error: boolean,
  error_msg: string,
  warnings: CsvWarning[]
}

