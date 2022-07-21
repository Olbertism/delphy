import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import { useEffect } from 'react';

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function About(props: Props) {
  const refreshUserProfile = props.refreshUserProfile;
  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);
  return (
    <>
      <Head>
        <title>About</title>
        <meta name="description" content="About" />
      </Head>

      <main>
        <Typography variant="h1" data-test-id="claim-h1">
          About
        </Typography>
        <Box sx={{ mb: '30px' }}>
          <Typography variant="h4">What is Delphy?</Typography>
          <Typography>
            Delphy is my final project for the{' '}
            <a href="https://upleveled.io/" target="_blank" rel="noreferrer">UpLeveled</a> Bootcamp Class of
            spring 2022. It is a Fact Check Tool with a social interactivity
            features.
          </Typography>
          <Typography variant="h4">How does it work?</Typography>
          <Typography>
            After registration/login, visit the Dashboard page. Enter a claim
            into the search field and click on "Search". Delphy fetches a couple
            of news resources and other knowledge databases. Once finished, you
            will see an overview below the search field.
          </Typography>
          <Typography>
            To evaluate your claim, click the "Run" button.
          </Typography>
          <Typography variant="h4">
            The popup mentioned some rate limits?
          </Typography>
          <Typography>
            Yes, please do not spam search and evaluation requests. Web
            resources are accessed with free plans of API services, some of them
            only allow 100 requests per day. Thank you for your understanding.
          </Typography>
          <Typography variant="h4">
            What does "Check claim against evaluation" mean?
          </Typography>
          <Typography>
            Once you hit the button, your entered claim together with the search
            results is sent to a pretrained machine learning model, which
            compares a short text abstract of each found resource with the claim
            you searched for. It tells you, if the two texts agree with each
            other, contradict each other, or are neutral. You will be presented
            an overview with all relevant contradictions and agreements between
            the claim you searched for and the search results.
          </Typography>
          <Typography variant="h4">
            How does this "evaluation" contribute to fact checking?{' '}
          </Typography>
          <Typography>
            The idea is the use "contradiction" and "agreements" as indicators
            for the "quality" or reliability of a claim. If a claim produces a
            lot of contradictions, stemming from known news sources, it can be
            assumed that it is potentially false.{' '}
          </Typography>
          <Typography variant="h4">
            How accurate are these predictions?
          </Typography>
          <Typography>
            Accuracy depends a lot on the following two factors:
          </Typography>
          <Typography>
            The entered claim and its phrasing: If the entered claim does not
            take a stance on something, the evaluation will most likely not
            produce any proper results. The claim should be as long as necessary
            but as short as possible.{' '}
          </Typography>
          <Typography>
            The claim search results: The quality of the search results can vary
            and their headlines are in most cases the decisive factor for the
            evaluation. Delphy will also fetch resources, that might not really
            be related to the entered claim, since this is what the external
            service we requested from responds. Inevitably, the model will
            receive text pieces that are relevant and also assess them. In some
            cases, this will result in a wrong "contradiction" or "agreement".
          </Typography>
          <Typography variant="h4">
            Why are there only "contradictions" and "agreements", where are the
            gray areas?
          </Typography>
          <Typography>
            The predictions are coming from the{' '}
            <a href="https://github.com/facebookresearch/fairseq/blob/main/examples/roberta/README.md" target="_blank" rel="noreferrer">
              roBERTa mnli model
            </a>{' '}
            from Meta. Since this model was trained on a very large data set,
            the decision was made to simply utilize this prediction feature,
            instead of creating a whole new model.
          </Typography>
          <Typography>
            The idea of using this "stance" approach stems from an old machine
            learning contest about fake news -{' '}
            <a href="http://www.fakenewschallenge.org/" target="_blank" rel="noreferrer">
              http://www.fakenewschallenge.org/
            </a>
            . The authors there made the point, that the approach of labeling a
            given resource as "real" or "fake" has a lot of real and potential
            problems. By using a "stance" approach, we can also utilize existing
            media resources as a baseline of comparison, which makes the
            evaluation more transparent.{' '}
          </Typography>
          <Typography variant="h4">
            The model often seems to find contradictions, but seldom agreements,
            even when simple facts are entered
          </Typography>
          <Typography>
            It does, doesn't it? I can't really answer this question, but it
            seems to me that for simple ground truths, the fetched media
            resources are of less relevancy or quality.{' '}
          </Typography>
          <Typography variant="h4">I have feedback for you</Typography>
          <Typography>
            There you go -&gt;{' '}
            <a href="https://github.com/Olbertism" target="_blank" rel="noreferrer">
              https://github.com/Olbertism
            </a>
          </Typography>
        </Box>
      </main>
    </>
  );
}
