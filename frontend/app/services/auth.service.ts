import { LoginForm, SignupForm } from "@/app/types/form.type";
import { sendRequest } from "@/lib/api/wrapprer";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/api/v1";

export type SignupPayload = Omit<SignupForm, "confirmPassword">;

export const authApi = {
  login(data: LoginForm) {
    return sendRequest<IBackendRes<User>>({
      url: `${API_URL}/auth/login`,
      method: "POST",
      body: data,
      useCredentials: true,
    });
  },

  signup(data: SignupPayload) {
    return sendRequest<IBackendRes<SignupPayload>>({
      url: `${API_URL}/auth/signup`,
      method: "POST",
      body: data,
    });
  },
};
