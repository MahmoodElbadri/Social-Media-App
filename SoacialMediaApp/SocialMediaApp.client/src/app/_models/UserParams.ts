import {User} from "./user";

export class UserParams{
  gender?: string;
  minAge: number = 18;
  maxAge: number = 100;
  pageNumber: number = 1;
  pageSize: number = 5;
  orderBy = 'lastActive';
  constructor(user:User | null) {
    if(user){
      if (user.gender === 'female') {
        this.gender = 'male';
      } else {
        this.gender = 'female';
      }
    }
  }
}
