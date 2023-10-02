import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      // User is not logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the user has the required role to access the route
    const allowedRoles = route.data['allowedRoles'] as string[];
    const token = localStorage.getItem('access_token')!;
    const userRole = this.authService.getUserRole(token);
    console.log(userRole)

    if (!userRole || !allowedRoles.includes(userRole)) {
      // User does not have the required role, redirect to a forbidden page or show an error message
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
