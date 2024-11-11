import {z} from 'zod';

export const BookAppointMentSchema = z.object({
    date: z.string().min(1,{message: 'Required'}),
    time: z.string().min(1,{message: 'Required'}),
    reason: z.string(),
});