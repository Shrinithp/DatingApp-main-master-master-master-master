export interface User{
    username: string;
    token: string;
    photoUrl: string;
    knownAs: string;
    gender: string;
    roles: string[]; //string array because we have admin and moderate aswell

}