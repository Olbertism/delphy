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
};

export type DashboardWidgetProps = {
  contents: DashboardWidgetPropsContents[];
};

export type DashboardWidgetDbSearchItem = {
  id: number;
  title: string;
  description: string;
};

export type DashboardWidgetDbSearchResults = {
  item: DashboardWidgetDbSearchItem;
  refIndex: number;
  score: number;
}[];

export type Claim = {
  id: number;
  title: string;
  authorId: number;
  description: string;
  added: Date;
  username?: string;
};

export type Review = {
  id: number;
  title: string;
  description: string;
  added: Date;
  authorId: number;
  claimId: number;
  verdictId?: number;
  username?: string;
};

export type Verdict = {
  id: number;
  verdict: string;
};

export type Label = {
  id: number;
  label: string;
};

export type ClaimLabel = {
  id: number;
  claim_id: number;
  label_id: number;
};

export type ClaimRequestbody = {
  title: string;
  description: string;
  authorId: number | undefined;
};

export type ReviewRequestbody = {
  title: string;
  description: string;
  authorId: number | undefined;
  claimId: number;
  verdictId?: number;
};

export type RatingRequestbody = {
  claimId: number;
  ratingValue: number;
  authorId: number | undefined;
};

export type SourceRequestbody = {
  sourceTitle: string;
  sourceUrl: string;
  reviewId: number;
};

export type ClaimLabelRequestbody = {
  claimId: number;
  labelId: number;
};

export type LabelRequestbody = {
  newLabel: string;
};

export type SourceEntry = { title: string; url: string };

export type Author = {
  id: number;
  userId: number;
};

export type DatabaseClaim = {
  claimId: number;
  claimTitle: string;
  authorId: number;
  claimDescription: string;
  added: Date;
  username?: string | undefined;
  ratings: number[];
  labels: string[];
  reviews: { review_id: number; review_title: string }[];
};

export type DatabaseReview = {
  reviewId: number;
  reviewTitle: string;
  reviewDescription: string;
  added: Date;
  authorId: number;
  claimId: number;
  claimTitle: string;
  verdict: string;
  username?: string | undefined;
  sources: { source_title: string; source_url: string }[];
};
