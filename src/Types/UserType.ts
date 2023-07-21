export type UserType = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  acceptTerm: boolean;
};

export type UserReplacePasswordType = {
  password: string;
  passwordNew: string;
};
