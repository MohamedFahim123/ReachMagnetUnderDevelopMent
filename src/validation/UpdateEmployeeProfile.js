import {z} from 'zod';

export const UpdateEmployeeProfileSchema = z.object({
    name: z.any(),
    email: z.string().email({message: 'Invalid Email Address'}),
    phone: z.any(),
    citizenship:  z.any(),
    official_id_or_passport: z.any(),
    image: z.any(),
    country_id: z.any(),
    city_id: z.any(),
    full_address: z.any(),
    address_one: z.any(),
    address_two: z.any(),
});