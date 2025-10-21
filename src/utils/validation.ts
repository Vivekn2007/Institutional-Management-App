import { z } from 'zod';

// Institute registration validation schema
export const instituteSchema = z.object({
  name: z.string()
    .min(2, 'Institute name must be at least 2 characters')
    .max(200, 'Institute name must be less than 200 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  website: z.string()
    .url('Invalid website URL')
    .max(255, 'Website URL must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  registrationNumber: z.string()
    .max(100, 'Registration number must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  establishedYear: z.number()
    .int('Year must be a whole number')
    .min(1800, 'Year must be after 1800')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .optional(),
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters')
    .trim(),
  userEmail: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be less than 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Professor registration validation schema
export const professorSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .optional()
    .or(z.literal('')),
  department_id: z.string()
    .uuid('Invalid department selection'),
  qualification: z.string()
    .max(200, 'Qualification must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  specialization: z.string()
    .max(200, 'Specialization must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  date_of_joining: z.string()
    .optional()
    .or(z.literal('')),
});

// Student registration validation schema
export const studentSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .optional()
    .or(z.literal('')),
  branch_id: z.string()
    .uuid('Invalid branch selection'),
  roll_number: z.string()
    .min(5, 'Roll number must be at least 5 characters')
    .max(50, 'Roll number must be less than 50 characters')
    .trim(),
  admission_year: z.number()
    .int('Year must be a whole number')
    .min(2000, 'Admission year must be after 2000')
    .max(new Date().getFullYear() + 1, 'Admission year cannot be more than next year')
    .optional(),
  current_semester: z.number()
    .int('Semester must be a whole number')
    .min(1, 'Semester must be at least 1')
    .max(12, 'Semester must be less than 12')
    .optional(),
  date_of_birth: z.string()
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  guardian_name: z.string()
    .max(100, 'Guardian name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  guardian_phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

// Department validation schema
export const departmentSchema = z.object({
  name: z.string()
    .min(2, 'Department name must be at least 2 characters')
    .max(200, 'Department name must be less than 200 characters')
    .trim(),
  code: z.string()
    .min(2, 'Department code must be at least 2 characters')
    .max(20, 'Department code must be less than 20 characters')
    .trim()
    .toUpperCase(),
  head_of_department: z.string()
    .max(100, 'HOD name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

// User registration validation schema
export const userRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  hobbies: z.string()
    .max(500, 'Hobbies must be less than 500 characters')
    .trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be less than 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'professor'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
