export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface Rating {
  id: string;
  userId: string;
  username: string;
  criteria: Record<string, number>;
  comment: string;
}

export interface Teacher {
  id: string;
  name:string;
  ratings: Rating[];
}

export type UserRole = 'Yönetici' | 'Standart Kullanıcı';
