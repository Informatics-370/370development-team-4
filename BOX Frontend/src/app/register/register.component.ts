import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Variables
  passwordVisible = false;
  confirmPasswordVisible = false;
  passwordsMatch = true;

  @ViewChild('addressInput', { static: true }) addressInput!: ElementRef<HTMLInputElement>;

  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit() {
    this.handleCheckboxChange();
    this.initAutocomplete();
  }

  initAutocomplete() {
    const inputElement = this.addressInput.nativeElement;

    const autocomplete = new google.maps.places.Autocomplete(inputElement);
    autocomplete.setFields(['formatted_address']);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        console.log('Selected address:', place.formatted_address);
      }
    });
  }

  // ========================================= Password Validation =============================================
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // ========================================= All Fields Validation =====================================
  // Validate all required fields are entered
  validateRequiredFields(): boolean {
    const fields = ['firstName', 'lastName', 'email', 'cellNo', 'password', 'confirmPassword', 'addressOne', 'postalAddress'];
    let isValid = true;

    fields.forEach((field) => {
      const fieldValue = (document.getElementById(field) as HTMLInputElement).value;
      if (fieldValue.trim() === '') {
        isValid = false;
        this.displayErrorMessage(`Please fill in the ${field} field.`);
      }
    });

    return isValid;
  }

  // ========================================= Contact No Validation =====================================
  // Validate contact number accepts only digits
  validateContactNumber(): boolean {
    const contactNumber = (document.getElementById('cellNo') as HTMLInputElement).value;
    const regex = /^\d+$/; // Only digits

    if (!regex.test(contactNumber)) {
      this.displayErrorMessage('Contact number should contain only digits.');
      return false;
    }

    return true;
  }

  // Validate VAT number accepts only digits if the user is a business
  validateVATNumber(): boolean {
    const isBusinessCheckbox = document.getElementById('isBusiness') as HTMLInputElement;
    const isBusiness = isBusinessCheckbox.checked;

    if (isBusiness) {
      const vatNumber = (document.getElementById('vatNo') as HTMLInputElement).value;
      const regex = /^\d+$/; // Only digits

      if (!regex.test(vatNumber)) {
        this.displayErrorMessage('VAT number should contain only digits.');
        return false;
      }
    }

    return true;
  }

  // Validate title field
  validateTitle(): boolean {
    const isBusinessCheckbox = document.getElementById('isBusiness') as HTMLInputElement;
    const isBusiness = isBusinessCheckbox.checked;

    if (isBusiness) {
      return true; // No need to validate title if the user is a business
    } else {
      const titleInput = document.getElementById('title') as HTMLInputElement;
      const title = titleInput.value;
      const validTitles = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof']; // Add more valid titles if needed

      if (!validTitles.includes(title)) {
        this.displayErrorMessage('Please select a valid title.');
        return false;
      }
    }

    return true;
  }



  validatePasswords() {
    const passwordInput = document.getElementById('password') as HTMLInputElement; // gets the password input
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement; // gets the confirm password input

    if (passwordInput.value !== confirmPasswordInput.value) {
      // check if passwords do not match
      this.passwordsMatch = false; // passwords do not match
    } else {
      this.passwordsMatch = true; // passwords match
    }
  }

  // Display an error message
  displayErrorMessage(message: string) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('text-danger');
    errorMessage.textContent = message;

    if (errorContainer) {
      errorContainer.appendChild(errorMessage);
    }
  }

  // Clear all error messages
  clearErrorMessages() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
      errorContainer.innerHTML = '';
    }
  }

  // Handle checkbox change event
  handleCheckboxChange() {
    const isBusinessCheckbox = document.getElementById('isBusiness') as HTMLInputElement;
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const vatNoInput = document.getElementById('vatNo') as HTMLInputElement;

    if (isBusinessCheckbox.checked) {
      titleInput.value = '';
      titleInput.disabled = true;
      vatNoInput.disabled = false;
    } else {
      titleInput.disabled = false;
      vatNoInput.disabled = true;
    }

    // Clear title error message if the user is a business
    if (isBusinessCheckbox.checked) {
      this.clearTitleErrorMessage();
    }
  }

  // Clear title error message
  clearTitleErrorMessage() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
      const titleError = errorContainer.querySelector('.title-error');
      if (titleError) {
        errorContainer.removeChild(titleError);
      }
    }
  }

  submitForm() {
    // Clear previous error messages
    this.clearErrorMessages();

    // Validate passwords
    this.validatePasswords();

    // Check if the passwords match
    if (!this.passwordsMatch) {
      return; // Stop form submission if passwords do not match
    }

    // Validate all fields are entered
    if (!this.validateRequiredFields()) {
      this.displayErrorMessage('Please fill in all required fields.');
      return;
    }

    // Validate contact number accepts only digits
    if (!this.validateContactNumber()) {
      this.displayErrorMessage('Contact number should only contain digits.');
      return;
    }

    // Validate VAT number accepts only digits
    if (!this.validateVATNumber()) {
      this.displayErrorMessage('VAT number should contain only digits.');
      return;
    }

    // Validate title field
    if (!this.validateTitle()) {
      this.displayErrorMessage('Please select a valid title.');
      return;
    }

    // Check if the user is a business
    const isBusinessCheckbox = document.getElementById('isBusiness') as HTMLInputElement;
    const isBusiness = isBusinessCheckbox.checked;

    // Clear and disable the title field if the user is a business
    const titleInput = document.getElementById('title') as HTMLSelectElement;
    if (isBusiness) {
      titleInput.value = '';
      titleInput.disabled = true;
    } else {
      titleInput.disabled = false;
    }

    // User object to be sent to the API
    const user = {
      emailaddress: (document.getElementById('email') as HTMLInputElement).value,
      password: (document.getElementById('confirmPassword') as HTMLInputElement).value,
      phoneNumber: (document.getElementById('cellNo') as HTMLInputElement).value,
      firstName: (document.getElementById('firstName') as HTMLInputElement).value,
      lastName: (document.getElementById('lastName') as HTMLInputElement).value,
      address: (document.getElementById('addressOne') as HTMLInputElement).value,
      title: (document.getElementById('title') as HTMLInputElement).value
    };

    console.log(user);

    // Call the AuthService to register the user
    this.authService.registerUser(user).subscribe(
      () => {
        // Registration successful
        console.log('Registration successful');
        this.showRegistrationSuccessPopup();
        this.router.navigate(['/login']);
      },
      (error) => {
        // Registration failed
        console.error('Registration failed', error);
      }
    );
  }

  showRegistrationSuccessPopup() {
    const popupElement = document.createElement('app-registration-success-popup');
    document.body.appendChild(popupElement);
  }
}
