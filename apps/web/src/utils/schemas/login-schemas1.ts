import { z } from 'zod';

const minPasswordLength = 8;

export const hasLowerCase = (val: string): boolean => /[a-z]+/.test(val);
export const hasUpperCase = (val: string): boolean => /[A-Z]+/.test(val);
export const hasNumber = (val: string): boolean => /\d+/.test(val);
export const PasswordSchema = z
  .string()
  .min(minPasswordLength, { message: `Password has to be minimum ${String(minPasswordLength)} characters` });
//   .refine(hasLowerCase, {
//     message: 'Password needs to have at least 1 lowercase letter',
//   })
//   .refine(hasUpperCase, {
//     message: 'Password needs to have at least 1 uppercase letter',
//   })
//   .refine(hasNumber, {
//     message: 'Password needs to have at least 1 number',
//   });

export const SignUpSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email(),
  password: PasswordSchema,
  //[inviteHashLabel]: z.string().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: PasswordSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  password: PasswordSchema,
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
