export type ChangeCodeType = {
  code: number;
  status: boolean;
  expirationDate: string;
  userId: string;
};

export type PasswordChangeCodeReplacePasswordType = {
  code: number;
  password: string;
};

export type ChangeCodeActiveAccountType = {
  code: number;
};
