import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z
      .string()
      .min(9, { message: "Phone number must be at least 9 digits" })
      .max(14, { message: "Phone number must not exceed 14 digits" })
      .regex(/^(\+62|62|0)[\d]{9,12}$/, {
        message: "Must be a valid phone number",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const RegisterFormViewModel = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof RegisterFormSchema>> = async (
    data,
  ) => {
    try {
      const { username, email, password, phoneNumber } = data;
      const url = `${process.env.NEXT_PUBLIC_APPLICATION_URL}/next-api/user-registration`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          phone: phoneNumber,
        }),
      });

      const responseData = await res.text();

      if (!res.ok) {
        toast.error(responseData);
        return;
      }
      toast.success(responseData);
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during registration");
      }
      console.error("Registration error:", error);
    }
  };

  return {
    form,
    onSubmit,
    showPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    showConfirmPassword,
    toggleConfirmPasswordVisibility: () =>
      setShowConfirmPassword((prev) => !prev),
  };
};

export default RegisterFormViewModel;
