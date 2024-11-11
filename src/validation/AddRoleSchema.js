import {z} from 'zod';

export const AddRoleSchema = z.object({
    name: z.string().min(1,{message: 'Required'})
});