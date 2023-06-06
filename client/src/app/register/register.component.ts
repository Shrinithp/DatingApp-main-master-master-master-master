import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  //we are going to get something from parent component(home) so we are using decorators
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  ValidationErrors: string[] | undefined;


  
  constructor(private accountService: AccountService, private fb: FormBuilder,
    private router: Router) {
    
  }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password:['',[Validators.required, 
        Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]],
      
    });
//both should be equal
//even if i add more char in pass it should validate with con-pass
   this.registerForm.controls['password'].valueChanges.subscribe({
    next:()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
   })
  }

  matchValues(matchTo: string): ValidatorFn{
    //reactive form derives from abstract control
    return(control: AbstractControl)=>{
      return control.value=== control.parent?.get(matchTo)?.value ? null: {notMatching: true}
    }

  }

  register(){
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth: dob};
    this.accountService.register(values).subscribe({
      next:() =>{
        this.router.navigateByUrl('/members')
      },
      error: error=> {
      this.ValidationErrors=error
      }
    })
   }

  cancel(){
   this.cancelRegister.emit(false);
  }

  //we donot want local timezone. so we are using this for uni timezone
  private getDateOnly(dob: string | undefined) {
    if(!dob) return;
    let theDob=new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset()))
    .toISOString().slice(0,10);

  }

}
