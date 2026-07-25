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
