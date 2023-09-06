import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faArrowUpFromBracket, faCircleNotch, faXmark, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { DropdownItem } from '../drop-down/drop-down.component';

type Fields = {
  file: File|undefined|null;
  dropdown?: DropdownItem
}

type CsvWarning = {
  dataType: string,
  ref: string,
  message: string
}

type CsvImportResponse = {
  error: boolean,
  error_msg: string,
  warnings: CsvWarning[]
}

type DropdownData = {
  label: string,
  dropdownItems: DropdownItem[]
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  state: 'waiting' | 'drag-over' | 'uploading' | 'failed' | 'completed' = 'waiting'

  faArrowUpFromBracket = faArrowUpFromBracket
  faCircleNotch = faCircleNotch
  faXmark = faXmark
  faPlus = faPlus
  faCheck = faCheck

  filename = ''
  @Input() dropdownData?: DropdownData
  uploadForm!: FormGroup

  @Input() url = ''
  @Input() title = ''
  @ViewChild('file') fileInput!: HTMLInputElement

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group<Fields>({
      file: null
    })
  }

  resetInput(event: Event) {
    event.preventDefault()
    this.fileInput.value = ''
    this.filename = ''
    this.state = 'waiting'
  }

  dragOverHandler(event: DragEvent) {
    event.preventDefault()
    if (!['waiting', 'success'].includes(this.state))
      return

    this.state = 'drag-over'
  }

  dragLeaveHandler(event: DragEvent) {
    event.preventDefault()
    if (this.state != 'drag-over')
      return

    this.state = 'waiting'
  }

  dropHandler(event: DragEvent) {
    event.preventDefault()
    // if (this.state != 'waiting' && this.state != 'drag-over') {
    if (!['waiting', 'drag-over'].includes(this.state)) {
      return
    }

    const item = event.dataTransfer?.items[0]
    if (item?.kind != 'file') {
      this.state = 'waiting'
      console.log('No es un archivo')
      return
    }

    const file = item.getAsFile()
    this.fileSelect(file!)
  }

  inputHandler(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files
    if (!files || files.length <= 0) {
      this.state = 'waiting'
      console.log('Ao hay archivos')
      return
    }

    const file = files[0]
    this.fileSelect(file)
  }


  fileSelect(file: File) {
    this.state = 'uploading'
    this.uploadForm.get('file')!.setValue(file)
    this.filename = this.uploadForm.get('file')!.value.name;

    this.submit()
  }

  submit() {
    const formData = new FormData()
    formData.append('file', this.uploadForm.get('file')!.value)

    this.http.post<CsvImportResponse>(env.baseUrl + this.url, formData)
      .subscribe(response => {
        console.log(response)
        if (response.error) {
          this.state = 'failed'
        } else {
          this.state = 'completed'
        }
      })
  }

}
