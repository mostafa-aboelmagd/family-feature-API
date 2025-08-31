import { Document } from 'mongoose';

export interface Family extends Document {
  members: Array<{
    userId: any;
    role: 'provider' | 'parent' | 'Child';
    permissions: string[];
  }>;
}