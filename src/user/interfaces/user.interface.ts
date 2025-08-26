import { Document } from 'mongoose';

export interface User extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  familyId: any;
  familyRole: 'provider' | 'parent' | 'Child' | null;
  familyPermissions: string[];
}