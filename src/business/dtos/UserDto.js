export class UserDto{
    fullName;
    email;
    token;
    constructor(firstName,secoundName,email,token){
        this.fullName = `${firstName} ${secoundName}`;
        this.email = email;
        this.token = token;
    }
}