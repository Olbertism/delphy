import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from '../setPostgresDefaultsOnHeroku';
import { ClaimLabel, Label, Verdict } from '../types';

setPostgresDefaultsOnHeroku();

config();

// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

type User = {
  id: number;
  username: string;
  roles: string[] | null;
};

type UserWithPasswordHash = User & {
  passwordHash: string;
};

type Session = {
  id: number;
  token: string;
};

type Author = {
  id: number;
  userId: number;
};

type Claim = {
  claimId: number;
  title: string;
  authorId: number;
  description: string;
  added: Date;
  username?: string;
};

type Review = {
  id: number;
  title: string;
  description: string;
  added: Date;
  authorId: number;
  claimId: number;
  verdictId?: number;
  username?: string;
};

type Rating = {
  id: number;
  rating: number;
  claimId: number;
  authorId: number;
};

type Source = {
  sourceTitle: string;
  sourceUrl: string;
  reviewId: number;
};

export async function createUser(username: string, passwordHash: string) {
  const [user] = await sql<[User]>`
  INSERT INTO users (username, password_hash) VALUES (${username}, ${passwordHash}) RETURNING id, username`;
  return camelcaseKeys(user);
}

export async function getUserById(userId: number) {
  if (!userId) return undefined;

  const [user] = await sql<[User | undefined]>`
  SELECT id, username FROM users WHERE id = ${userId}`;
  return user && camelcaseKeys(user);
}

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[User | undefined]>`
  SELECT id, username FROM users WHERE username = ${username}`;
  return user && camelcaseKeys(user);
}

export async function getUserWithHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[UserWithPasswordHash | undefined]>`
  SELECT * FROM users WHERE username = ${username}`;
  return user && camelcaseKeys(user);
}

export async function createSession(token: string, userId: User['id']) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions (token, user_id) VALUES (${token}, ${userId}) RETURNING id, token`;

  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

export async function getUserByValidSessionToken(token: string) {
  if (!token) return undefined;
  const [user] = await sql<[User | undefined]>`
  SELECT
  users.id, users.username,

  (SELECT array_agg(roles.role)
  FROM roles, user_roles
  WHERE
    roles.id = user_roles.role_id AND
    user_roles.user_id = users.id
    ) AS roles

  FROM
    users, sessions
  WHERE
    sessions.token = ${token}
  AND sessions.user_id = users.id
  AND sessions.expiry_timestamp > now();
  `;

  await deleteExpiredSessions();

  return user && camelcaseKeys(user);
}

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM sessions WHERE sessions.token = ${token} RETURNING *`;
  return session && camelcaseKeys(session);
}

// check this here by time...
export async function deleteExpiredSessions() {
  const sessions = await sql<[Session[]]>`
  DELETE FROM sessions WHERE sessions.expiry_timestamp < now() RETURNING *`;
  /* if (!sessions) {
    console.log('Session ins deleteExpired undefined');
  } */
  return sessions.map((session) => camelcaseKeys(session));
}

// Content Functions

export async function checkIfAuthorExists(userId: number) {
  const [author] = await sql<[Author | undefined]>`
  SELECT * FROM authors WHERE user_id = ${userId}`;

  if (!author) {
    return false;
  } else {
    return camelcaseKeys(author);
  }
}

export async function createAuthor(userId: number) {
  const [author] = await sql<[Author]>`
  INSERT INTO authors (user_id) VALUES (${userId}) RETURNING id, user_id`;

  return camelcaseKeys(author);
}

export async function getUserThroughAuthorId(authorId: number) {
  const [user] = await sql<[User | undefined]>`
  SELECT users.id, users.username FROM users, authors WHERE authors.id = ${authorId} AND authors.user_id = users.id`;

  return user && camelcaseKeys(user);
}

export async function createClaim(
  title: string,
  description: string,
  authorId: number,
) {
  const [claim] = await sql<[Claim]>`
  INSERT INTO claims (title, description, author_id) VALUES (${title}, ${description}, ${authorId}) RETURNING *`;

  return camelcaseKeys(claim);
}

export async function getClaimById(claimId: number) {
  const [claim] = await sql<[Claim | undefined]>`
  SELECT * FROM claims WHERE id = ${claimId}`;

  return claim && camelcaseKeys(claim);
}

export async function getAllClaims() {
  const claims = await sql<[Claim[]]>`
  SELECT * FROM claims`;

  return claims.map((claim) => camelcaseKeys(claim));
}

export async function getAllClaimsForSearch() {
  const claims = await sql<[Claim[]]>`
  SELECT id, title, description FROM claims`;

  return claims.map((claim) => camelcaseKeys(claim));
}

export async function getAllClaimsWithReviewIds() {
  const claims = await sql<[Claim[]]>`

SELECT claims.id AS claim_id,
    claims.title AS claim_title,
    claims.description AS claim_description,
    claims.added AS claim_added,
    claims.author_id AS author_id,
    ARRAY_AGG (reviews.id) AS review_ids
     FROM claims
LEFT JOIN reviews
       ON claims.id = reviews.claim_id
GROUP BY claims.id;
  `;

  return claims.map((claim) => camelcaseKeys(claim));
}

export async function getAllClaimsForSearchWithReviews() {
  const claims = await sql<[Claim[]]>`
    SELECT claims.id AS claim_id,
    claims.title AS claim_title,
    claims.description AS claim_description,
    (
       SELECT json_agg(reviews) FROM (
         SELECT
           reviews.id AS review_id,
           reviews.title AS review_title
         FROM
           reviews
         WHERE
           reviews.claim_id = claims.id
       ) AS reviews)
       AS reviews
FROM claims;
  `;
  return claims.map((claim) =>
    camelcaseKeys(claim, {
      deep: true,
    }),
  );
}

export async function getAllClaimsWithUsernamesAndReviewIds() {
  const claims = await sql<[Claim[]]>`
    SELECT claims.id AS claim_id,
    claims.title AS claim_title,
    claims.description AS claim_description,
    claims.added AS claim_added,
    users.username AS username,
    (
       SELECT json_agg(reviews) FROM (
         SELECT
           reviews.id AS review_id,
           reviews.title AS review_title
         FROM
           reviews
         WHERE
           reviews.claim_id = claims.id
       ) AS reviews)
       AS reviews
FROM claims, users, authors
WHERE
         users.id = authors.user_id AND
         authors.id = claims.author_id;
  `;
  return claims.map((claim) =>
    camelcaseKeys(claim, {
      deep: true,
    }),
  );
}

export async function getClaimByIdWithUsername(claimId: number) {
  const [claim] = await sql<[Claim | undefined]>`

    SELECT
    claims.id AS claim_id,
    users.username AS username
    FROM
    claims, users, authors
    WHERE
    claims.id = ${claimId} AND
    users.id = authors.user_id AND
    authors.id = claims.author_id;
  `;
  return claim && camelcaseKeys(claim);
}

export async function getClaimWithAllRelationsById(claimId: number) {
  const [claim] = await sql<[Claim | undefined]>`

SELECT claims.id AS claim_id,
    claims.title AS claim_title,
    claims.description AS claim_description,
    claims.added AS claim_added,
    users.username AS username,
    authors.id AS author_id,

(SELECT json_agg(reviews) FROM (
         SELECT
           reviews.id AS id,
           reviews.title AS title
         FROM
           reviews
         WHERE
           reviews.claim_id = claims.id)
       AS reviews)
       AS reviews,

(SELECT array_agg(ratings.rating)
  FROM ratings
  WHERE ratings.claim_id = claims.id
  ) AS ratings,

(SELECT array_agg(labels.label)
  FROM labels, claim_labels
  WHERE
    labels.id = claim_labels.label_id AND
    claim_labels.claim_id = claims.id
    ) AS labels

FROM
  claims, users, authors
WHERE
  claims.id = ${claimId} AND
  users.id = authors.user_id AND
  authors.id = claims.author_id;


  `;

  return claim && camelcaseKeys(claim);
}

export async function createReview(
  title: string,
  description: string,
  authorId: number,
  claimId: number,
  verdictId?: number,
) {
  if (!verdictId) {
    const [review] = await sql<[Review]>`
  INSERT INTO reviews (title, description, author_id, claim_id) VALUES (${title}, ${description}, ${authorId}, ${claimId}) RETURNING *`;
    return camelcaseKeys(review);
  } else {
    const [review] = await sql<[Review]>`
  INSERT INTO reviews (title, description, author_id, claim_id, verdict_id) VALUES (${title}, ${description}, ${authorId}, ${claimId}, ${verdictId}) RETURNING *`;
    return camelcaseKeys(review);
  }
}

export async function getAllReviews() {
  const reviews = await sql<[Review[]]>`
  SELECT * FROM reviews`;

  return reviews.map((review) => camelcaseKeys(review));
}

export async function getReviewById(reviewId: number) {
  const [review] = await sql<[Review | undefined]>`
  SELECT * FROM reviews WHERE id = ${reviewId}`;

  return review && camelcaseKeys(review);
}

export async function getAllReviewsWithUsernamesAndClaims() {
  const reviews = await sql<[Review[]]>`

SELECT reviews.id AS review_id,
    reviews.title AS review_title,
    reviews.description AS review_description,
    reviews.added AS review_added,
    users.username AS username,
    (
       SELECT json_build_object('claim_id', claim_id, 'claim_title', claim_title) FROM (
         SELECT
           claims.id AS claim_id,
           claims.title AS claim_title
         FROM
           claims
         WHERE
           reviews.claim_id = claims.id
       ) AS claim)
       AS claim
FROM users, authors, reviews
WHERE
         users.id = authors.user_id AND
         authors.id = reviews.author_id;


  `;
  return reviews.map((review) =>
    camelcaseKeys(review, {
      deep: true,
    }),
  );
}

export async function getReviewByIdWithUsername(reviewId: number) {
  const [review] = await sql<[Review | undefined]>`
    SELECT
    reviews.id AS review_id,
    users.username AS username
    FROM
    reviews, users, authors
    WHERE
    reviews.id = ${reviewId} AND
    reviews.author_id = authors.id AND
    authors.user_id = users.id;
  `;
  return review && camelcaseKeys(review);
}

export async function getReviewWithAllRelationsById(reviewId: number) {
  const [review] = await sql<[Review | undefined]>`

SELECT reviews.id AS review_id,
    reviews.title AS review_title,
    reviews.description AS review_description,
    reviews.added AS review_added,
    users.username AS username,
    claims.id AS claim_id,
    claims.title AS claim_title,
    verdicts.verdict AS verdict,
    reviews.verdict_id AS verdict_id,
    authors.id AS author_id,

(SELECT json_agg(sources) FROM (
         SELECT
           sources.id AS source_id,
           sources.title AS source_title,
           sources.url AS source_url
         FROM
           sources
         WHERE
           sources.review_id = reviews.id)
       AS sources)
       AS sources

FROM
reviews
LEFT JOIN verdicts
  ON verdicts.id = reviews.verdict_id,
  claims, users, authors

WHERE
  reviews.id = ${reviewId} AND
  reviews.claim_id = claims.id AND
  reviews.author_id = authors.id AND
  authors.user_id = users.id;


  `;
  return review && camelcaseKeys(review);
}

export async function createRating(
  claimId: number,
  ratingValue: string,
  authorId: number,
) {
  const [rating] = await sql<[Rating]>`
  INSERT INTO ratings (rating, claim_id, author_id) VALUES (${ratingValue}, ${claimId}, ${authorId}) RETURNING *`;
  return camelcaseKeys(rating);
}

export async function createSource(
  sourceTitle: string,
  sourceUrl: string,
  reviewId: number,
) {
  const [source] = await sql<[Source]>`
  INSERT INTO sources (title, url, review_id) VALUES (${sourceTitle}, ${sourceUrl}, ${reviewId}) RETURNING *`;
  return camelcaseKeys(source);
}

export async function getAllVerdicts() {
  const verdicts = await sql<[Verdict[]]>`
  SELECT * FROM verdicts`;
  return verdicts.map((verdict) => camelcaseKeys(verdict));
}

export async function createLabel(newLabel: string) {
  const [label] = await sql<[Label]>`
  INSERT INTO labels (label) VALUES (${newLabel}) RETURNING *`;
  return camelcaseKeys(label);
}

export async function createClaimLabelPair(claimId: number, labelId: number) {
  const [claimLabel] = await sql<[ClaimLabel]>`
  INSERT INTO claim_labels (claim_id, label_id) VALUES (${claimId}, ${labelId}) RETURNING *`;
  return camelcaseKeys(claimLabel);
}

export async function getAllLabels() {
  const labels = await sql<[Label[]]>`
  SELECT * FROM labels`;
  return labels.map((label) => camelcaseKeys(label));
}

export async function getClaimsByUsername(username: string) {
  const claims = await sql`
  SELECT
  claims.id AS claim_id,
  claims.title AS claim_title,
  claims.added AS claim_added

  FROM claims, users, authors

  WHERE users.username = ${username} AND users.id = authors.user_id AND authors.id = claims.author_id;`;

  return claims.map((claim) => camelcaseKeys(claim));
}

export async function getReviewsByUsername(username: string) {
  const reviews = await sql`
  SELECT
  reviews.id AS review_id,
  reviews.title AS review_title,
  reviews.added AS review_added,
  claims.id AS claim_id,
  claims.title AS claim_title

  FROM claims, reviews, users, authors

  WHERE users.username = ${username} AND users.id = authors.user_id AND authors.id = reviews.author_id AND reviews.claim_id = claims.id;`;

  return reviews.map((review) => camelcaseKeys(review));
}

export async function checkAuthorClaimRating(
  claimId: number,
  authorId: number,
) {
  const [rating] = await sql<[Rating | undefined]>`
  SELECT rating FROM ratings WHERE ratings.claim_id = ${claimId} and ratings.author_id = ${authorId};`;
  return rating;
}

export async function deleteClaimById(id: number) {
  const [claim] = await sql<[Claim | undefined]>`
  DELETE FROM claims WHERE claims.id = ${id} RETURNING *`;
  return claim && camelcaseKeys(claim);
}

export async function deleteReviewById(id: number) {
  const [review] = await sql<[Review | undefined]>`
  DELETE FROM reviews WHERE reviews.id = ${id} RETURNING *`;
  return review && camelcaseKeys(review);
}
