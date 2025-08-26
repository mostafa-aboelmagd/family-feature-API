import { Schema } from 'mongoose';

export const FamilySchema = new Schema(
    {
    members: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'FamilyMember',
                required: true,
            },
            role: {
                type: String,
                enum: ['provider', 'parent', 'Child', null],
                required: true,
            },
            permissions: {
                type: [String],
                default: [],
            },
        },
    ],
    }, {
        timestamps: true,
    }
);