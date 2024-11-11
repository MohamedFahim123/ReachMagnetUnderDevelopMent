import {z} from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(1,{message: 'Required'}),
    email: z.string().email({message: 'Invalid Email Address'}),
    phone: z.string().min(1,{message: 'Required'}),
    phone_code: z.string().min(1,{message: 'Required'}),
    password: z.string().min(1,{message: 'Required'}),
    password_confirmation: z.string(),
    industry_id: z.any(),
    country_id: z.string().min(1,{message: 'Required'}),
    city_id: z.string().min(1,{message: 'Required'}),
    address_one: z.string().min(1,{message: 'Required'}),
    address_two: z.string(),
    image: z.any().refine((files) => files?.length === 1, 'Please upload an Image.'),
    official_id_or_passport: z.any().refine((files) => files?.length === 1, 'Please upload an Image.'),
}).superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
    ctx.addIssue({
        path: ['password_confirmation'],
        message: 'Passwords must match',
    });
}});
