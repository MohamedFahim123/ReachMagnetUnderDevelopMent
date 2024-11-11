import {z} from 'zod';

export const AddEmployeeSchema = z.object({
    name: z.string().min(1,{message: 'Required'}),
    email: z.string().email({message: 'Invalid Email Address'}),
    phone: z.string().min(1,{message: 'Required'}),
    password: z.string().min(1,{message: 'Required'}),
    country_id: z.string().min(1,{message: 'Required'}),
    city_id: z.string().min(1,{message: 'Required'}),
    citizenship: z.string().min(1,{message: 'Required'}),
    full_address: z.string().min(1,{message: 'Required'}),
    title: z.string().min(1,{message: 'Required'}),
    official_id_or_passport: z.any().refine((files) => files?.length === 1, 'Please upload an Image.'),
    role_id: z.string().min(1,{message: 'Required'}),
    image: z.any().refine((files) => files?.length === 1, 'Please upload an Image.'),
})
