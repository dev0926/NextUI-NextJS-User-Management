export interface User {
  id: number;
  registered: Date;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  adminNotes?: string;
}

export interface FetchData {
  success: boolean;
  data: User[];
}
