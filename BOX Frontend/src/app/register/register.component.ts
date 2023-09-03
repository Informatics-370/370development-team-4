import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
  isBusiness: boolean = false;
  redirectURL = '';

  @ViewChild('addressInput', { static: true }) addressInput!: ElementRef<HTMLInputElement>;

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}
  
    ngOnInit() {
        this.initAutocomplete();
    this.handleCheckboxChange();    
    //Retrieve the redirect URL from url
    this.activatedRoute.paramMap.subscribe(params => {
      //URL will come as 'redirect-' + url e.g. 'redirect-cart'
      let url = params.get('redirectTo')?.split('-');
      console.log(url ? url[1] : 'no redirect');
      if (url) this.redirectURL = url[1];
    });

    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

    passwordInput.addEventListener('input', () => {
        this.checkPasswords();
    });

    confirmPasswordInput.addEventListener('input', () => {
        this.checkPasswords();
    });
  }

  initAutocomplete() {
    const inputElement = this.addressInput.nativeElement;

    const autocompleteOptions = {
      componentRestrictions: { country: 'ZA' } // Restrict to South Africa
    };

    const autocomplete = new google.maps.places.Autocomplete(inputElement, autocompleteOptions);
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
  // validateRequiredFields(): boolean {
  //   const fields = ['firstName', 'lastName', 'email', 'cellNo', 'password', 'confirmPassword', 'addressInput'];
  //   let isValid = true;

  //   fields.forEach((field) => {
  //     const fieldValue = (document.getElementById(field) as HTMLInputElement).value;
  //     if (fieldValue.trim() === '') {
  //       isValid = false;
  //       this.displayErrorMessage(`Please fill in the ${field} field.`);
  //     }
  //   });

  //   return isValid;
  // }

  // ========================================= Contact No Validation =====================================
  // Validate contact number accepts only digits
    validateContactNumber(): boolean {
      const contactNumber = (document.getElementById('cellNo') as HTMLInputElement).value;
      const regex = /^\d+$/; // Only digits

      if (!regex.test(contactNumber)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Contact Number',
          text: 'Contact number should contain only digits.'
        });
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
  
      if (vatNumber.trim() !== '' && !regex.test(vatNumber)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid VAT Number',
          text: 'VAT number should contain only digits.'
        });
        return false;
      }
    }
  
    return true;
  }
  

  // Validate title field
  validateTitle(): boolean {
    const isBusinessCheckbox = document.getElementById('isBusiness') as HTMLInputElement;
    const isBusiness = isBusinessCheckbox.checked;
  
    if (!isBusiness) {
      const titleInput = document.getElementById('title') as HTMLInputElement;
      const title = titleInput.value;
      const validTitles = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof']; // Add more valid titles if needed
  
      if (!validTitles.includes(title)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Title',
          text: 'Please select a valid title.'
        });
        return false;
      }
    }
  
    return true;
  }
  


  checkPasswords() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Check if passwords match
    this.passwordsMatch = password === confirmPassword;
  }

  validatePassword() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Check if passwords match
    if (password !== confirmPassword) {
      this.passwordsMatch = false;
      return;
    } else {
      this.passwordsMatch = true;
    }

    // Check password criteria: length, uppercase, lowercase, digit
    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const lowercaseValid = /[a-z]/.test(password);
    const digitValid = /\d/.test(password);

    if (lengthValid && uppercaseValid && lowercaseValid && digitValid) {
      
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Password Invalid',
        text: 'Password should have at least 8 characters, including an uppercase letter, a lowercase letter, and a digit.'
      });
    }
  }

  // Handle checkbox change event
  handleCheckboxChange() {
    const isBusinessCheckbox = document.getElementById('isBusiness') as HTMLInputElement;

    this.isBusiness = isBusinessCheckbox.checked;
    console.log(this.isBusiness)
}

submitForm() {

  // Array to hold error messages
  const errorMessages: string[] = [];

  //Validate
  if (this.isBusiness) {
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value.trim();
    if (firstName === '') {
      errorMessages.push('Please fill in the First Name field.');
    }
  
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    if (email === '') {
      errorMessages.push('Please fill in the Email field.');
    }
  
    const cellNo = (document.getElementById('cellNo') as HTMLInputElement).value.trim();
    if (cellNo === '') {
      errorMessages.push('Please fill in the Contact Number field.');
    }
  
    const password = (document.getElementById('password') as HTMLInputElement).value.trim();
    if (password === '') {
      errorMessages.push('Please fill in the Password field.');
    }
  
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value.trim();
    if (confirmPassword === '') {
      errorMessages.push('Please fill in the Confirm Password field.');
    }
  
    const address = (document.getElementById('addressInput') as HTMLInputElement).value.trim();
    if (address === '') {
      errorMessages.push('Please fill in the Address field.');
    }
  
    const vatNo = (document.getElementById('vatNo') as HTMLInputElement).value.trim();
    if (vatNo === '') {
      errorMessages.push('Please fill in the VAT Number field.');
    }
  } else {
    const title = (document.getElementById('title') as HTMLInputElement).value.trim();
    if (title === '') {
      errorMessages.push('Please select a Title.');
    }
  
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value.trim();
    if (firstName === '') {
      errorMessages.push('Please fill in the First Name field.');
    }
  
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value.trim();
    if (lastName === '') {
      errorMessages.push('Please fill in the Last Name field.');
    }
  
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    if (email === '') {
      errorMessages.push('Please fill in the Email field.');
    }
  
    const cellNo = (document.getElementById('cellNo') as HTMLInputElement).value.trim();
    if (cellNo === '') {
      errorMessages.push('Please fill in the Contact Number field.');
    }
  
    const password = (document.getElementById('password') as HTMLInputElement).value.trim();
    if (password === '') {
      errorMessages.push('Please fill in the Password field.');
    }
  
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value.trim();
    if (confirmPassword === '') {
      errorMessages.push('Please fill in the Confirm Password field.');
    }
  
    const address = (document.getElementById('addressInput') as HTMLInputElement).value.trim();
    if (address === '') {
      errorMessages.push('Please fill in the Address field.');
    }
  }


  // Validate passwords
  this.validatePassword();
  if (!this.passwordsMatch) {
    errorMessages.push('Passwords do not match.');
  }

  // Validate contact number accepts only digits
  if (!this.validateContactNumber()) {
    errorMessages.push('Contact number should only contain digits.');
  }

  // Validate VAT number accepts only digits
  if (!this.validateVATNumber()) {
    errorMessages.push('VAT number should contain only digits.');
  }

  // Validate title field
  if (!this.validateTitle()) {
    errorMessages.push('Please select a valid title.');
  }

  // Check if the user is a business
  const isBusinessCheckbox = document.getElementById('isBusiness') as HTMLInputElement;
  const isBusiness = isBusinessCheckbox.checked;

  if (errorMessages.length > 0) {
    // Display SweetAlert with error messages
    Swal.fire({
      icon: 'error',
      title: 'Validation Errors',
      html: errorMessages.map(msg => `<p>${msg}</p>`).join('')
    });

    return; // Stop form submission if there are validation errors
  }

  // User object to be sent to the API
  const user = {
    emailaddress: (document.getElementById('email') as HTMLInputElement).value,
    password: (document.getElementById('confirmPassword') as HTMLInputElement).value,
    //employeeId: "",
    phoneNumber: (document.getElementById('cellNo') as HTMLInputElement).value,
    firstName: (document.getElementById('firstName') as HTMLInputElement).value,
    lastName: this.isBusiness ? '' : (document.getElementById('lastName') as HTMLInputElement).value,
    address: (document.getElementById('addressInput') as HTMLInputElement).value,
    //title: this.isBusiness ? '' : (document.getElementById('title') as HTMLInputElement).value,
    isBusiness: isBusiness,
    vatNo: !this.isBusiness ? '' : (document.getElementById('vatNo') as HTMLInputElement).value,
  };

  console.log(user);

    // Call the AuthService to register the user
  this.authService.registerUser(user).subscribe(
    () => {
      // Registration successful
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have successfully registered.',
        timer: 2000 // Automatically close after 2 seconds
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            if (this.redirectURL != '') {
                this.router.navigate(['/login', 'redirect-' + this.redirectURL]);
            }
            else this.router.navigate(['/login']);
        }
      });
    },
    (error) => {
      console.error('Error in registration', error);
      // Registration failed
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'An error occurred during registration. Please try again later.'
      });
    }
  );
}
}
