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

export type RoBERTaPrediction = number[];

export type DashboardWidgetPropsContents = {
    title: string;
    url: string;
    promptSource: string;
    prediction: number;
  }[];


export type DashboardWidgetProps = {
  query: string;
  contents: DashboardWidgetPropsContents[]
};

export type Claim = {
  id: number;
  title: string;
  authorId: number;
  description: string;
  added: Date;
  username? : string
};