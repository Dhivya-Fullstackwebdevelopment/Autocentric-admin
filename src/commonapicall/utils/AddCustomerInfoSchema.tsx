import { z } from "zod";

export const vehicleSchema = z.object({
    id: z.string().optional(),
    registration_number: z.string().min(1, "Car reg is required"),
    make: z.string().optional(),
    fuel_type: z.string().optional(),
    tax_status: z.string().optional(),
    mileage:z.string().optional(),
    year_of_manufacture:  z.string().min(1, " Year is required"),
    colour: z.string().optional(),
    mot_expiry_date: z.string().optional(),
});

export const customerSchema = z.object({
    full_name: z.string().min(1, "Full Name is required"),
    // home_address: z.string().min(1, "Address is required"),
    home_address: z.string().optional(),
    phone_number: z.string()
        .min(10, "Phone number is required")
        .refine(val => /^\d+$/.test(val), "Phone number must contain only digits"),
    // postal_code: z.string().min(1, "Post code is required"),
    postal_code: z.string().optional(),
    email: z
        .string()
        .min(3, "Email is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    date: z.string(), // or use Zod.date() if using Date object
    remarks: z.string().nullable().optional(),
    vehicles: z.array(vehicleSchema).min(1, "At least one vehicle is required"),
});

export type CustomerFormType = z.infer<typeof customerSchema>;
export type VehicleType = z.infer<typeof vehicleSchema>;
// export type CustomerFormType = z.infer<typeof customerSchema>;