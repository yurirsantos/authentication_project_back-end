export type PasswordChangeCodeType = {
  code: number;
  status: boolean;
  expirationDate: string;
  userId: string;
};

export type PasswordChangeCodeReplacePasswordType = {
  code: number;
  password: string;
};
