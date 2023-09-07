import { Injectable } from '@angular/core';
import { CsvImportResponse } from './CsvImportResponse';

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {

  private errorLog: string[] = []
  private warningLog: string[] = []

  constructor() {
    this.errorLog.push('error1', 'error2', 'error3')
    this.warningLog.push('warning1', 'warning2', 'warning3')
  }

  pushCsvImportResponse(response: CsvImportResponse) {
    this.errorLog.push(response.error_msg)
    this.warningLog.push(...response.warnings.map(
      w => `${w.dataType} => ${w.ref}: ${w.message}`
    ))
  }

  pushError(text: string) {
    this.errorLog.push(text)
  }

  pushWarning(text: string) {
    this.warningLog.push(text)
  }

  getErrorLog() {
    return this.errorLog
  }

  getWarningLog() {
    return this.warningLog
  }

  deleteErrorLogEntry(idx: number) {
    if (idx >= this.errorLog.length) {
      return false
    }
    this.errorLog.splice(idx, 1)
    return true
  }

  deleteWarningLogEntry(idx: number) {
    if (idx >= this.warningLog.length) {
      return false
    }
    this.warningLog.splice(idx, 1)
    return true
  }

  clearErrors() {
    this.errorLog = []
  }

  clearWarnings() {
    this.warningLog = []
  }


}
