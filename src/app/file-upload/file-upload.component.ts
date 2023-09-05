import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faArrowUpFromBracket, faCircleNotch, faXmark, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';

type Fields = {
  file: File|undefined|null;
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
  @Input() url = ''
  filename = ''
  uploadForm!: FormGroup
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
    this.state = 'waiting'
  }

  dragOverHandler(event: DragEvent) {
    event.preventDefault()
    if (this.state != 'waiting')
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
    if (this.state != 'waiting' && this.state != 'drag-over') {
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

    // Por implementar
    this.http.post(env.baseUrl + this.url, formData)
      .subscribe(response => {
        console.log(response)
        this.filename = ''
      })
  }

}
