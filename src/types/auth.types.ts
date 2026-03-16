export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  email: string;
  password: string;
  username?: string;
};

export type RequestPasswordResetPayload = {
  email: string;
  redirectTo: string;
};
