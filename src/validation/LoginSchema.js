import {z} from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({message: 'Invalid Email Address'}),
    password: z.string().min(1,{message: 'Password Is Required'})
});