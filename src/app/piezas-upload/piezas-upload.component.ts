import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faArrowUpFromBracket, faCircleNotch, faXmark, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { catchError, Observable, throwError } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { CsvWarning, CsvImportResponse } from '../CsvImportResponse';
import { ErrorLogService } from '../error-log.service';


type FieldData = {
  ref: string,
  name: string,
  price: string,
  estanteria: string
}

type Fields = {
  data: FieldData[] | null
}

@Component({
  selector: 'app-piezas-upload',
  templateUrl: './piezas-upload.component.html',
  styleUrls: ['./piezas-upload.component.scss']
})
export class PiezasUploadComponent {
  state: 'waiting' | 'drag-over' | 'uploading' | 'failed' | 'completed' = 'waiting'

  faArrowUpFromBracket = faArrowUpFromBracket
  faCircleNotch = faCircleNotch
  faXmark = faXmark
  faPlus = faPlus
  faCheck = faCheck

  filename = ''

  uploadForm!: FormGroup

  @Input() url = ''
  @Input() title = ''
  @Input() inputName = 'file'
  @ViewChild('file') fileInput!: HTMLInputElement

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private log: ErrorLogService
  ) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group<Fields>({
      data: null
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
      console.log('No hay archivos')
      return
    }

    const file = files[0]
    this.fileSelect(file)
  }

  fileSelect(file: File) {
    console.log('fileSelect');
    this.state = 'uploading'
    this.processData(file, this.uploadData);
  }

  csvToJson(csv: string) {
    console.log('csvToJson');
    const lines = csv.split("\n")
    const result: FieldData[] = []

    for(let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;

      const current = lines[i].split(';');
      const obj: FieldData = {
        ref: current[0] ?? '',
        name: current[1] ?? '',
        price: current[2] ?? '',
        estanteria: current[3] ?? ''
      };

      result.push(obj);
    }

    return result;
  }

  async processData(file: File, callback: (chunk: FieldData[]) => Promise<any>) {
    console.log('processData');
    const data = this.csvToJson(await file.text()); // get the data;
    const chunk_size = 100;
    for (let i = 0; i < data.length; i+=chunk_size) {
      const chunk = data.slice(i, i + chunk_size);
      await callback(chunk);
    }
  }

  async uploadData(data: FieldData[]) {
    console.log('uploadData');
    const uploadForm = this.formBuilder.group<Fields>({
      data: data
    });
    console.log('uploadData');
    this.submit(uploadForm)
  }

  submit(uploadForm: FormGroup) {
    console.log('submit');
    const formData = new FormData()
    formData.append(this.inputName, uploadForm.get('data')!.value)

    this.http.post<CsvImportResponse>(env.baseUrl + this.url, formData)
      .pipe(catchError(this.handleError))
      .subscribe(response => {
        console.log(response)
        if (response.error) {
          this.state = 'failed'
        } else {
          this.state = 'completed'
        }
        this.log.pushCsvImportResponse(response)
      })
  }

  private handleError = (error: HttpErrorResponse) => {
    const msg = 'Error fatal: ' + error.message
    console.log(error)
    this.state = 'failed'
    this.log.pushError(msg)
    return throwError(() => new Error(msg))
  }

}
