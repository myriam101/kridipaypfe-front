import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListproductsAdminComponent } from './listproducts-admin.component';


describe('ListproductsComponent', () => {
  let component: ListproductsAdminComponent;
  let fixture: ComponentFixture<ListproductsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListproductsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListproductsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
