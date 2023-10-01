import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor() {}

  initAutocomplete(addressInput: ElementRef<HTMLInputElement>) {
    const autocompleteOptions = {
      componentRestrictions: { country: 'ZA' }, // Restrict to South Africa
    };

    const autocomplete = new google.maps.places.Autocomplete(
      addressInput.nativeElement,
      autocompleteOptions
    );
    autocomplete.setFields(['formatted_address']);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        console.log('Selected address:', place.formatted_address);
      }
    });
  }
}
