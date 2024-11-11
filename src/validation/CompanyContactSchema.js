import {z} from 'zod';

export const CompanyContactSchema = z.object({
    fullName: z.string().min(1, { message: 'Your Name is Required'}),
    phoneNumber: z.string().min(1,{message: 'Phone Number is Required'}),
    email: z.string().email({message: 'Invalid Email Address'}),
    description: z.string().min(1,{message: 'Description is Required'})
});