export const POST = async (req: Request) => {
  const { email, username, password } = await req.json();
  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      },
    );

    const responseData = await backendRes.json();

    if (!backendRes.ok) {
      return new Response(responseData.message, {
        status: backendRes.status,
      });
    }

    return new Response(
      "Registration successful! Please wait while admin approves your account",
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    } else {
      return new Response("An unexpected error occurred during registration", {
        status: 500,
      });
    }
  }
};
