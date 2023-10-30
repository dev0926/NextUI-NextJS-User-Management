export interface User {
  id: string;
  registered: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  adminNotes?: string;
}
