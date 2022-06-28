import { InputOutlined, InputRounded } from '@mui/icons-material';
import { Button, InputBase, TextField } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  checkIfAuthorExists,
  getUserByValidSessionToken,
} from '../../util/database/database';

type Props = {
  refreshUserProfile: () => Promise<void>;
  author?: any;
};

type ClaimRequestbody = {
  title: string;
  description: string;
  authorId: number | undefined;
};

type ReviewRequestbody = {
  title: string;
  description: string;
  authorId: number | undefined;
  claimId: number;
  verdictId?: number;
};

export default function Database(props: Props) {
  const [authorId, setAuthorId] = useState<number | undefined>(
    props.author === null ? undefined : props.author.id,
  );
  const [newClaimTitle, setNewClaimTitle] = useState('');
  const [newClaimDescription, setNewClaimDescription] = useState('');

  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewDescription, setNewReviewDescription] = useState('');

  const [selectedClaim, setSelectedClaim] = useState(0);
  const [selectedVerdict, setSelectedVerdict] = useState(0);

  console.log('author: ', authorId);

  const refreshUserProfile = props.refreshUserProfile;

  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);

  const handleAuthorCreation = async () => {
    const response = await fetch('/api/createAuthor');
    const author = await response.json();
    return author;
  };

  const handleClaimCreation = async () => {
    const requestbody: ClaimRequestbody = {
      title: newClaimTitle,
      description: newClaimDescription,
      authorId: undefined, // value is inserted further below
    };

    if (!props.author) {
      console.log('user not yet an author, let me handle that...');
      const { author } = await handleAuthorCreation();

      if (!author) {
        console.log('An error ocurred while trying to create a new author');
        return;
      }

      requestbody.authorId = author.id;
      setAuthorId(author.id);
    } else {
      requestbody.authorId = authorId;
    }

    const response = await fetch('/api/createClaim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    const claim = await response.json();
    return claim;
  };

  const handleReviewCreation = async (claimId: number, verdictId: number) => {
    const requestbody: ReviewRequestbody = {
      title: newReviewTitle,
      description: newReviewDescription,
      authorId: undefined, // value is inserted further below
      claimId: claimId,
    };

    if (!props.author) {
      console.log('user not yet an author, let me handle that...');
      const { author } = await handleAuthorCreation();

      if (!author) {
        console.log('An error ocurred while trying to create a new author');
        return;
      }

      requestbody.authorId = author.id;
      setAuthorId(author.id);
    } else {
      requestbody.authorId = authorId;
    }

    if (verdictId !== 0) {
      requestbody.verdictId = verdictId;
    }

    const response = await fetch('/api/createReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    const review = await response.json();
    return review;
  };

  return (
    <>
      <Head>
        <title>Add Database entry</title>
        <meta name="description" content="Add entry" />
      </Head>

      <main>
        <h1>Add something</h1>

        <section>
          <h2>claim</h2>
          <TextField
            value={newClaimTitle}
            onChange={(event) => {
              setNewClaimTitle(event.currentTarget.value);
            }}
          />
          <TextField
            value={newClaimDescription}
            onChange={(event) => {
              setNewClaimDescription(event.currentTarget.value);
            }}
          />
          <Button
            onClick={() => {
              handleClaimCreation();
            }}
          >
            Create Claim
          </Button>
        </section>
        <section>
          <h2>review</h2>
          <TextField
            value={selectedClaim}
            onChange={(event) => {
              setSelectedClaim(Number(event.currentTarget.value));
            }}
          />
          <TextField
            value={newReviewTitle}
            onChange={(event) => {
              setNewReviewTitle(event.currentTarget.value);
            }}
          />
          <TextField
            value={newReviewDescription}
            onChange={(event) => {
              setNewReviewDescription(event.currentTarget.value);
            }}
          />
          <Button
            onClick={() => {
              handleReviewCreation(selectedClaim, selectedVerdict);
            }}
          >
            Create Review
          </Button>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const author = await checkIfAuthorExists(user.id);
    if (author) {
      console.log('user logged in, is author');
      return { props: { user: user, author: author } };
    }
    console.log('user logged in, but not an author');
    return { props: { user: user, author: null } };
  }

  console.log('no user logged in');
  return { props: {} };
}
