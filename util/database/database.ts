import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

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
  id: number;
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
  users.id, users.username
  FROM
    users, sessions
  WHERE
    sessions.token = ${token}
  AND sessions.user_id = users.id
  AND sessions.expiry_timestamp > now();
  `;

  // for a check...
  console.log('Spam?', user);

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
  if (!sessions) {
    console.log('Session ins deleteExpired undefined');
  }
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
