import { Document } from 'mongoose';

export interface Invitation extends Document {
  email: string;
  familyId: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'rejected';
}