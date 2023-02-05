import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: {
    headers: string[]
    values: string[][]
  } = {
    headers: [],
    values: [],
  }

  itemsPerPage = 10
  pagesCount = 0
  rowsCount = 0;

  pageData$ = new Subject<string[][]>()

  constructor() {}

  setData(data: { headers: string[]; values: string[][] }): void {
    this.data = data
    this.rowsCount = data.values.length
  }

  setPageData(pageIndex: number) {
    const startIndex = (pageIndex - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    this.pagesCount = Math.floor(this.data.values.length / this.itemsPerPage)
    this.pageData$.next(this.data.values.slice(startIndex, endIndex))
  }

  getHeaders(): string[] {
    return this.data.headers
  }

  getPageData(): Observable<string[][]> {
    return this.pageData$.asObservable()
  }

  getPageCount(): number {
    return this.pagesCount
  }

  getRowsCount(): number {
    return this.rowsCount
  }
}
