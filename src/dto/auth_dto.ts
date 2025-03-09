export enum AuthType {
  GMAIL = "gmail",
  REGULAR = "regular",
}

export class RegisterDto {
  public name: string;
  public email: string;
  public password: string;
  public image: string | undefined;

  constructor(data: UserRegister) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.image = data.image;
  }
}

export class UserLoginDto {
  public email: string;
  public password: string;

  constructor(data: UserLogin) {
    this.email = data.email;
    this.password = data.password;
  }
}

export class UserDto {
  public id: string;
  public name: string;
  public email: string;
  public password: string | null | undefined;
  public image: string | null | undefined;
  public refreshToken: string | null | undefined;
  public accessToken: string | null | undefined;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.image = data.image;
    this.refreshToken = data.refreshToken;
    this.accessToken = data.accessToken;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
