import {z} from 'zod';

export const BusinessRegisterSchema = z.object({
    company_name: z.string().min(1,{message: 'Required'}),
    company_email: z.string().email({message: 'Invalid Email Address'}),
    company_main_type: z.any(),
    registeration_number: z.string().min(1,{message: 'Required'}),
    phone_one: z.string().min(1,{message: 'Required'}),
    phone_one_code: z.string().min(1,{message: 'Required'}),
    phone_two: z.any(),
    phone_two_code: z.any(),
    documents: z.any(),
    category_id: z.string().min(1,{message: 'Required'}),
    sub_category_id: z.string().min(1,{message: 'Required'}),
    industry_id: z.string().min(1,{message: 'Required'}),
    website_link: z.string().min(1,{message: 'Required'}),
    activity_id: z.any(),
    sub_activity_id: z.any(),
    logo:  z.any(),

    company_country_id: z.string().min(1,{message: 'Required'}),
    company_city_id: z.string().min(1,{message: 'Required'}),
    company_area_id: z.string().min(1,{message: 'Required'}),
    company_full_address: z.string().min(1,{message: 'Required'}),
    latitude: z.any(),
    longitude: z.any(),

    employee_name: z.string().min(1,{message: 'Required'}),
    employee_email: z.string().email({message: 'Invalid Email Address'}),
    employee_phone_code: z.string().min(1,{message: 'Required'}),
    employee_phone: z.string().min(1,{message: 'Required'}),
    employee_title: z.string().min(1,{message: 'Required'}),
    employee_country_id: z.string().min(1,{message: 'Required'}),
    employee_city_id: z.string().min(1,{message: 'Required'}),
    employee_full_address: z.string().min(1,{message: 'Required'}),
    employee_citizenship_id: z.string().min(1,{message: 'Required'}),
    official_id_or_passport:  z.any(),
    employee_password: z.string().min(1,{message: 'Required'}),
    employee_password_confirmation: z.string(),

    is_benifical_owner: z.any(),
    comfirm_policies: z.any(),
}).superRefine((data, ctx) => {
    if (data.employee_password !== data.employee_password_confirmation) {
    ctx.addIssue({
        path: ['employee_password_confirmation'],
        message: 'Passwords must match',
    });
}});