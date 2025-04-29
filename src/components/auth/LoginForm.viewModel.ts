import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rememberedUser";
const LAST_AUTH_ATTEMPT_KEY = "lastAuthAttempt";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().default(false),
});

const LoginFormViewModel = () => {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("/dashboard");

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    // Debug logging for search params
    console.log("Search Params:", {
      callbackUrl: searchParams.get("callbackUrl"),
      redirect: searchParams.get("redirect"),
    });

    // Get redirect URL from query parameters
    const callbackUrl =
      searchParams.get("callbackUrl") || searchParams.get("redirect");
    if (callbackUrl) {
      setRedirectUrl(callbackUrl);
    }

    // Load remembered user
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

    // Check for recent authentication attempts to prevent rapid re-attempts
    const lastAttempt = localStorage.getItem(LAST_AUTH_ATTEMPT_KEY);
    if (lastAttempt) {
      const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt, 10);
      if (timeSinceLastAttempt < 5000) {
        // 5 seconds cooldown
        console.warn("Preventing rapid authentication attempts");
      }
    }
  }, [form, searchParams]);

  const onSubmit: SubmitHandler<z.infer<typeof LoginFormSchema>> = async (
    data,
  ) => {
    // Prevent multiple submissions
    if (isLoading) return;

    setLoading(true);

    // Record authentication attempt timestamp
    localStorage.setItem(LAST_AUTH_ATTEMPT_KEY, Date.now().toString());

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

      // Enhanced debugging: Log authentication attempt details
      console.log("Authentication Attempt:", {
        email,
        redirectUrl,
        rememberMe,
      });

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: redirectUrl,
      });

      // Additional session verification
      const session = await getSession();
      console.log("Session after login:", session);

      if (session && !res?.error) {
        toast.success("Login successful");
        // Force a hard reload to ensure session is updated
        window.location.href = redirectUrl || "/dashboard";
      } else {
        if (res?.error === "CredentialsSignin") {
          toast.error("Invalid email or password");
        } else {
          toast.error("Failed to sign in");
          console.error("Login failed:", res?.error);
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
    } finally {
      setLoading(false);
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
    isLoading,
    clearRememberedUser,
    showPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    redirectUrl,
    setRedirectUrl,
  };
};

export default LoginFormViewModel;
