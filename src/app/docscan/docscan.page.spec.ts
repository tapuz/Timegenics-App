import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocscanPage } from './docscan.page';

describe('DocscanPage', () => {
  let component: DocscanPage;
  let fixture: ComponentFixture<DocscanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocscanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocscanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
