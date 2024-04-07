import { z } from 'zod'
export const registerSchema = z.object({
    email: z
    .string()
    .min(5, {
        message: 'Please fill in the email field.'
    })
    .email({
        message: 'Please enter a valid email address'
    }),
    name: z
    .string()
    .min(5, {
        message: 'Name should be at least 5 characters long.'
    })
    .max(20, {
        message: 'Name should be at maximum 20 characters long.'
    }),
    password: z.
    string()
    .min(8, {
        message: 'Password should be at least 5 characters long.'
    })
    .max(20, {
        message: 'Password should be at maximum 20 characters long.'
    }).
    regex(/[A-Z]/, {
        message: 'Password must have one uppercase character'
    })
    .regex(/[a-z]/, {
        message: 'Password must have one lowercase character'
    })
    .regex(/\d/,{
        message: 'Password must have at least one digit'
    })
    .regex(/\W/, {
        message: 'Password must have at least one special character.'
    })
})
export const loginSchema = z.object({
    email: z
    .string()
    .min(1, {
        message: 'Must fill in email field'
    }),
    password: z
    .string()
    .min(1, {
        message: 'Must fill in password field'
    })
})

export type InputType = z.infer<typeof registerSchema>
export type LoginType = z.infer<typeof loginSchema>