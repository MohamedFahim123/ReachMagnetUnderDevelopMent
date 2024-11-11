import {z} from 'zod';

export const UpdateCompanyDataSchema = z.object({
    email: z.string().email({message: 'Invalid Email Address'}),
    full_address: z.string().min(1,{message: 'Required'}),
    category_id: z.string().min(1,{message: 'Required'}),
    sub_category_id:  z.string().min(1,{message: 'Required'}),
    about_us: z.any(),
    logo: z.any(),
    main_type: z.any(),
    cover: z.any(),
    website_link: z.string().min(1,{message: 'Required'}),
    linkedin_link: z.any(),
    founded: z.any(),
});