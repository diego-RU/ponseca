import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { BookingComponent } from './booking.component';

describe('BookingComponent phone validator', () => {
  function getPhoneControl() {
    const fixture = TestBed.createComponent(BookingComponent);
    const form = (fixture.componentInstance as unknown as { form: { controls: { phone: any } } })
      .form;
    return form.controls.phone;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  const validInputs = [
    '+51 960 719 103',
    '+51 999 999 999',
    '+51 960719103',
    '+51960719103',
    '999999999',
    '999 999 999',
    '+51-960-719-103',
    '83 421 234',
  ];

  for (const input of validInputs) {
    it(`accepts ${JSON.stringify(input)}`, () => {
      const phone = getPhoneControl();
      phone.setValue(input);
      expect(phone.valid).toBe(true);
    });
  }

  const invalidInputs = ['', 'abc', '12345', '+1 999 999 9999'];

  for (const input of invalidInputs) {
    it(`rejects ${JSON.stringify(input)}`, () => {
      const phone = getPhoneControl();
      phone.setValue(input);
      expect(phone.valid).toBe(false);
    });
  }
});
