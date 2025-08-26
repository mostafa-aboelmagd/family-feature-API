import { Schema } from 'mongoose';

export const UserSchema = new Schema(
    {
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    familyId: {
        type: Schema.Types.ObjectId,
        ref: 'Family',
        default: null, //
    },
    familyRole: {
        type: String,
        enum: ['provider', 'parent', 'Child', null],
        default: null,
    },
    familyPermissions: {
        type: [String],
        default: [],
    },
    },
    {
        timestamps: true,
    }
);