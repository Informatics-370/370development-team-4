export interface Customer {
    customerId: string;
    userId: string;
    employeeId: string;
    isBusiness: boolean;
    vatNo: string;
    creditLimit?: number;
    creditBalance?: number;
    discount?: number;
    user: User; // Include user information
    employee: Employee; // Include employee information
  }
  
  export interface User {
    firstName: string;
    lastName: string;
    address: string;
    title: string;
    email: string;
  }
  
  export interface Employee {
    userId: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    address: string;
    title: string;
    phoneNumber: string;
    email: string;
  }
  