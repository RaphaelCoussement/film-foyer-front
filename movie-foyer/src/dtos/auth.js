export class RegisterDto {
    constructor(email, password, displayName) {
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }
}

export class LoginDto {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}


export class AuthResponseDto {
    constructor(token, displayName, isAdmin) {
        this.token = token;
        this.displayName = displayName;
        this.isAdmin = isAdmin;
    }
}