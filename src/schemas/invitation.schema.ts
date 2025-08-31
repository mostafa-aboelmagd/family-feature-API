import { Schema } from 'mongoose';

export const InvitationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      required: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'FamilyMember',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);