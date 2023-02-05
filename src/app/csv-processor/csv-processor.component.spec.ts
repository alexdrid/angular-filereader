import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvProcessorComponent } from './csv-processor.component';

describe('CsvProcessorComponent', () => {
  let component: CsvProcessorComponent;
  let fixture: ComponentFixture<CsvProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CsvProcessorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
