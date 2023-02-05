import { Component, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { DataService } from '../data.service'

@Component({
  selector: 'app-csv-processor',
  standalone: true,
  imports: [CommonModule, MatButtonModule,],
  template: `
    <input id="upload" #upload type="file" (change)="onFIleChange($event)" hidden/>
    <button mat-raised-button (click)="upload.click()">Upload</button>
  `,
})
export class CsvProcessorComponent {
  @Output() uploadPending = new EventEmitter<boolean>();
  @Output() fileUploaded = new EventEmitter<boolean>();

  chunkSize = 1024 * 1024 // 1 MB chunk size

  headers: string[] = []
  data: string[][] = []
  csvData: string = ''
  rowCount = 0

  constructor(private dataService: DataService) {}

  onFIleChange(event: Event) {
    this.uploadPending.emit(true)
    const file = (<HTMLInputElement>event.target).files[0]

    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(
        new URL('./file-upload.worker.ts', import.meta.url),
      )
      worker.onmessage = ({ data }) => {
        this.dataService.setData(data)
        this.uploadPending.emit(false)
        this.fileUploaded.emit(true)
      }

      // worker.
      worker.postMessage(file)
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  async processFile(reader: ReadableStreamDefaultReader<Uint8Array>) {
    let result = await reader.read()
    let chunk = new TextDecoder('utf-8').decode(
      result.value || new Uint8Array(),
    )
    let lines = chunk.split('\n')

    for (let i = 0; i < lines.length - 1; i++) {
      this.csvData += lines[i]
      let line = this.csvData.trim()
      if (line.endsWith(',')) {
        this.csvData += '\n'
        continue
      }

      this.processLine(line)
      this.csvData = ''
    }

    this.csvData += lines[lines.length - 1]

    if (!result.done) {
      this.processFile(reader)
    } else {
      console.log(`Finished processing file. Found ${this.rowCount} rows`)
    }
  }

  processLine(line: string) {
    this.rowCount++
    if (!(this.headers.length > 0)) {
      this.headers = line
        .replace(/^"|"$/g, '')
        .replace(/^\n|\n$/g, '')
        .split(',')
      console.log(this.headers)

      return
    }

    const regex = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g
    const values = []
    let match

    while ((match = regex.exec(line))) {
      let value = match[2] || match[1] || match[3]
      value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
      values.push(value)
    }

    if (this.headers.length !== values.length) {
      console.log(
        `Line has ${values.length} values, expected ${this.headers.length}`,
      )
      return
    }

    this.data.push(values)
  }
}
