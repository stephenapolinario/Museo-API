import mongoose, { Document, Schema } from 'mongoose';

export interface IRole {
    name: string;
}

export interface IRoleModel extends IRole, Document {}

const RoleSchema: Schema = new Schema(
    {
        role: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model<IRoleModel>('Role', RoleSchema);
