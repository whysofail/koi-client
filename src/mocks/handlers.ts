import { http, HttpResponse } from "msw";
import { Role } from "nextauth";

const mockUser = {
  id: "123",
  name: "Test User",
  email: "test@example.com",
  role: "user" as Role,
};

const mockToken = {
  name: mockUser.name,
  email: mockUser.email,
  sub: mockUser.id,
  id: mockUser.id,
  role: mockUser.role,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  jti: "mock-jwt-id",
};

const mockSession = {
  user: {
    ...mockUser,
    id: mockUser.id,
    role: mockUser.role,
  },
};

export const nextAuthHandlers = [
  http.post(`${process.env.BACKEND_URL}/api/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // Mock credentials check
    if (body?.email === "test@example.com" && body?.password === "password") {
      return HttpResponse.json({
        token: "mock-jwt-token",
        user: {
          user_id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),

  http.get(`${process.env.BACKEND_URL}/api/auth/session`, () => {
    return HttpResponse.json(mockSession);
  }),

  http.post("/api/auth/callback/credentials", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (
      body?.email === "test@example.com" &&
      (body?.password as string) === "password"
    ) {
      return HttpResponse.json(mockToken);
    }

    return new HttpResponse(null, { status: 401 });
  }),

  http.get("/api/auth/csrf", () => {
    return HttpResponse.json({
      csrfToken: "mock-csrf-token",
    });
  }),

  http.post("/api/auth/signout", () => {
    return HttpResponse.json({ url: "/login" });
  }),

  http.get("/api/auth/providers", () => {
    return HttpResponse.json({
      credentials: {
        id: "credentials",
        name: "Credentials",
        type: "credentials",
        signInUrl: "/api/auth/signin/credentials",
        callbackUrl: "/api/auth/callback/credentials",
      },
    });
  }),
];
