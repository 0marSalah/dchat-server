declare global {
  enum AuthType {
    GMAIL = "gmail",
    REGULAR = "regular",
  }

  interface Data {
    type: AuthType;
    name: string;
    email: string;
    password?: string;
    image?: string;
    isRemember?: boolean;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    password: string | null | undefined;
    image: string | null | undefined;
    refreshToken: string | null | undefined;
    accessToken: string | null | undefined;
    resetToken: string | null | undefined;
    createdAt: Date;
    updatedAt: Date;
  }

  interface UserRegister {
    name: string;
    email: string;
    password: string;
    image?: string;
  }

  interface UserRegisterGmail {
    name: string;
    email: string;
    password?: string;
    image?: string;
  }

  interface UserRequest {
    id: string;
    email: string;
  }

  interface UserLogin {
    email: string;
    password: string;
  }
}

export {};
