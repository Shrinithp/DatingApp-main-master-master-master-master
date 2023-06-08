import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl= "http://localhost:5001/api/";

  constructor(private http: HttpClient) { }


getUserWithRoles() {
  return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
}
}
