import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams,  } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelpers';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  //I should use environment here but im using hard code here
  //baseUrl=environment.apiUrl;

  baseUrl = "http://localhost:5001/api/";
  //to store the state of members
  members: Member[] = [];
  userParams: UserParams | undefined;
  user: User | undefined;
  
  //creating member cache
  memberCache= new Map(); 
  //if i use map we have get set options key value pair
  //key-joined values
  //value-paginatedResult


  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user){
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
   }

   getUserParams(){
    return this.userParams
   }

   setUserParams(params: UserParams) {
    this.userParams = params;
   }

   resetUserParams(){
    if(this.user){
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return
   }

  getMembers(userParams: UserParams) {


    //creating a cache join all userparam using - (18-99-1-5)    
    const response = this.memberCache.get(Object.values(userParams).join('-'))

    if(response) return of(response);
    //httpparams is class given by angular to set query string parameters with http
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);



    //this is for storing state
    // if(this.members.length>0) return of(this.members);
    return getPaginatedResult<Member[]>(this.baseUrl+'users', params, this.http).pipe(
      map(response=> {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
      
    )

    //we also need to send token with this. so we use gethttpoptions


  }


  getMember(username: string) {
    //getting members stored inside memberCache

    //initially we have an array with paginatd result in it which we got from membercache 
    const member = [...this.memberCache.values()]

    .reduce((arr, elem)=> arr.concat(elem.result),[])
   //conct elemts inside array instead of having seperate array
    
    .find((member: Member)=> member.userName===username)

    //of operator creates an observable that emits a single value and completes
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/'+ username)
  }

  //I have made a interceptor for tokens so that i dont have to do send again and again


  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        //spread operator takes all of elements inside the members
        this.members[index] = {...this.members[index], ...member}
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);

}

 addLike(username: string) {
  return this.http.post(this.baseUrl + 'likes/' + username, {});
 }

 getLikes(predicate: string, pageNumber: number, pageSize: number){
  let params =getPaginationHeaders(pageNumber, pageSize);

  params = params.append('predicate', predicate)
  return getPaginatedResult<Member[]>(this.baseUrl+ 'likes', params, this.http);
 }




}