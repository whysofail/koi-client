import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rememberedUser";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().default(false),
});

const LoginFormViewModel = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    try {
      const remembered = localStorage.getItem(STORAGE_KEY);
      if (remembered) {
        const { email, rememberMe } = JSON.parse(remembered);
        form.reset({
          email,
          password: "",
          rememberMe,
        });
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      console.error("Error loading remembered user:", error);
    }
  }, [form]);

  const onSubmit: SubmitHandler<z.infer<typeof LoginFormSchema>> = async (
    data,
  ) => {
    try {
      const { email, password, rememberMe } = data;

      if (rememberMe) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            email,
            rememberMe: true,
          }),
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!res?.error) {
        toast.success("Login successful");
        router.push(callbackUrl);
      } else {
        switch (res.error) {
          case "CredentialsSignin":
            toast.error("Invalid email or password");
            break;
          case "AccessDenied":
            toast.error("Access denied. Please contact support.");
            break;
          default:
            toast.error("Failed to sign in");
        }

        if (!data.rememberMe) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }

      console.error("Login error:", error);
    }
  };

  const clearRememberedUser = () => {
    localStorage.removeItem(STORAGE_KEY);
    form.reset({
      email: "",
      password: "",
      rememberMe: false,
    });
  };

  return {
    form,
    onSubmit,
    clearRememberedUser,
    showPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
  };
};

export default LoginFormViewModel;
