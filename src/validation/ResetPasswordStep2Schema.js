import {z} from 'zod';

// export const ResetPasswordStep2Schema = z.object({
//     email: z.string().email({message: 'Invalid Email Address'}),
//     otp: z.string().min(1,{message: 'Required'}),
//     new_password: z.string().min(1,{message: 'Required'}),
//     new_password_confirmation: z.string().min(1,{message: 'Required'}),
// }).superRefine((data, ctx) => {
//     if (data.new_password !== data.new_password_confirmation) {
//     ctx.addIssue({
//         path: ['new_password_confirmation'],
//         message: 'Passwords must match',
//     });
// }});
export const ResetPasswordStep2Schema = (loginType) => z.object({
    email: z.string().email({ message: 'Invalid Email Address' }),
    otp: z.string().min(1, { message: 'Required' }),
    [loginType === 'employee' ? 'password' : 'new_password']: z.string().min(1, { message: 'Required' }),
    [loginType === 'employee' ? 'password_confirmation' : 'new_password_confirmation']: z.string().min(1, { message: 'Required' }),
}).superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation && loginType === 'employee') {
        ctx.addIssue({
            path: ['password_confirmation'],
            message: 'Passwords must match',
        });
    } else if (data.new_password !== data.new_password_confirmation && loginType !== 'employee') {
        ctx.addIssue({
            path: ['new_password_confirmation'],
            message: 'Passwords must match',
        });
    }
});