export class CreateUserDto {
    firstName;
    secoundName;
    email;
    phone;
    password;
    confirmPassword;
    constructor(firstname, secoundname, email, phone, password,confirmPassword) {
        this.firstName = firstname;
        this.secoundName = secoundname;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}