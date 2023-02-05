import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from '../data.service'
import { Observable } from 'rxjs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div *ngIf="values">
      <table>
        <tr>
          <th *ngFor="let header of headers">
            {{ header }}
          </th>
        </tr>
        <tr *ngFor="let row of values">
          <td *ngFor="let cell of row">
            {{ cell }}
          </td>
        </tr>
      </table>
      <button (click)="previousPage()" [disabled]="currentPage === 1">
        Previous
      </button>
      Page {{ currentPage }} of {{ pagesCount }}
      <button (click)="nextPage()" [disabled]="currentPage === pagesCount - 1">
        Next
      </button>
    </div>
  `,
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit {
  public itemsPerPage = 10
  public currentPage = 1
  pagesCount: number

  headers: string[]
  values: string[][]
  // values$: Observable<string[][]>

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dataService.setPageData(this.currentPage)
    }, 500)

    this.dataService.pageData$.subscribe((data) => {
      this.headers = this.dataService.getHeaders()
      this.values = data
      this.pagesCount = this.dataService.getPageCount();
    })
  }

  nextPage() {
    this.currentPage = Math.min(this.currentPage + 1, this.dataService.getRowsCount() - 1)
    this.dataService.setPageData(this.currentPage)
  }

  previousPage() {
    this.currentPage = Math.max(this.currentPage - 1, 0)
    this.dataService.setPageData(this.currentPage)
  }
}
