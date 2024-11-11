import {z} from 'zod';

export const UserVirificationSchema = z.object({
    otp: z.string().min(1,{message: 'Invalid otp Address'})
});