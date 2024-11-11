import {z} from 'zod';

export const UpdatePasswordSchema = z.object({
    current_password: z.string().min(1,{message: 'Required'}),
    new_password: z.string().min(1,{message: 'Required'}),
    new_password_confirmation: z.string().min(1,{message: 'Required'}),
}).superRefine((data, ctx) => {
    if (data.new_password !== data.new_password_confirmation) {
    ctx.addIssue({
        path: ['new_password_confirmation'],
        message: 'Passwords must match',
    });
}});