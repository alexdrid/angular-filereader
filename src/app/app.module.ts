import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CsvProcessorComponent } from "./csv-processor/csv-processor.component";
import { PaginatorComponent } from "./paginator/paginator.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        CsvProcessorComponent,
        PaginatorComponent,
        BrowserAnimationsModule,
        MatProgressSpinnerModule
    ]
})
export class AppModule { }
