import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PictureproofPage } from './pictureproof.page';

describe('PictureproofPage', () => {
  let component: PictureproofPage;
  let fixture: ComponentFixture<PictureproofPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureproofPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PictureproofPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
