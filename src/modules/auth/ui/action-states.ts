export type RegisterActionState = Readonly<{
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}>;

export const initialRegisterActionState: RegisterActionState = { success: false, message: "" };

export type LoginActionState = Readonly<{
  status: "IDLE" | "INVALID" | "PENDING_EMAIL_CONFIRMATION" | "PENDING_APPROVAL";
  message: string;
}>;

export const initialLoginActionState: LoginActionState = { status: "IDLE", message: "" };

export type ForgotPasswordActionState = Readonly<{
  success: boolean;
  message: string;
  emailError?: string;
}>;
export const initialForgotPasswordActionState: ForgotPasswordActionState = {
  success: false,
  message: "",
};
export type ResetPasswordActionState = Readonly<{
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}>;
export const initialResetPasswordActionState: ResetPasswordActionState = {
  success: false,
  message: "",
};
