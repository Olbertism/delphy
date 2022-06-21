export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      user: { id: number; username: string };
    };

export type RegisterError = {
  message: string;
}[];

export type LoginResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      user: { id: number; username: string };
    };

export type LoginError = {
  message: string;
}[];

export type User = {
  id: number;
  username: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export type RoBERTaPrompt = [string, string];
