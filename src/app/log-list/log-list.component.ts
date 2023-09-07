import { Component } from '@angular/core';
import { ErrorLogService } from '../error-log.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent {

  faXmark = faXmark

  constructor(public log: ErrorLogService) {}

  deleteError(idx: number) {
    this.log.deleteErrorLogEntry(idx)
  }

  deleteWarning(idx: number) {
    this.log.deleteWarningLogEntry(idx)
  }

}
