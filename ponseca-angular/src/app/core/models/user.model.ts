export type UserRole = 'admin' | 'recepcionista';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}
