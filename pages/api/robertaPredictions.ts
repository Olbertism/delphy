import { readFile } from 'node:fs/promises';
import { JWT } from 'google-auth-library';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.body);
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  // dev URL
  // const apiBaseUrl = `http://127.0.0.1:5000/predict`;

  const servicekeybuffer = await readFile('google-credentials.json');
  const servicekey = JSON.parse(servicekeybuffer.toString());

  const client = new JWT({
    email: servicekey.client_email,
    key: servicekey.private_key,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const parameters = {
    source: {
      fields: {},
    },
  };

  const instances = req.body.instances;
  /* const instances = [
    {
      source: 'Mars is not a Planet',
      comparer: 'Mars is a Planet',
    },
    {
      source: 'Climate change is real and a threat',
      comparer: 'Climate change has to be considered as a threat',
    },
  ]; */

  // presumed type def: <AIPlatform.protos.google.cloud.aiplatform.v1.IPredictResponse>
  // not found...

  const { data }: any = await client.request({
    url:
      'https://europe-west1-aiplatform.googleapis.com/v1/' +
      `projects/${process.env.PROJECT_ID}/locations/europe-west1/endpoints/${process.env.ENDPOINT_ID}` +
      ':predict',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: {
      instances: instances,
      parameters,
    },
  });

  const predictions = data.predictions;

  console.log(predictions);

  // ORIGINAL SAMPLE CODE - GIVES ERROR WITH THE INSTANCES OBJECT

  // Specifies the location of the api endpoint
  /* const clientOptions = {
    apiEndpoint: 'europe-west1-aiplatform.googleapis.com',
  };

  // Instantiates a client
  const predictionServiceClient = new PredictionServiceClient(clientOptions);

  async function predictCustomTrainedModel() {
    const endpoint = `projects/${process.env.PROJECT_ID}/locations/europe-west1/endpoints/${process.env.ENDPOINT_ID}`;

    const parameters = {
      source: {
        fields: {},
      },
    };

    // sample - change later on
    const instances = [
      {
        source: 'Mars is not a Planet',
        comparer: 'Mars is a Planet',
      },
      {
        source: 'Climate change is real and a threat',
        comparer: 'Climate change has to be considered as a threat',
      },
    ];

    const request = {
      endpoint,
      instances: instances,
      parameters,
    };
    console.log("REQUEST:", request)

    const [response] = await predictionServiceClient.predict(request);
    console.log(response)

  }

  predictCustomTrainedModel(); */

  try {
    res.json({ status: 'ok', predictions: predictions }); // Send the response
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', message: 'No valid response received' });
  }
}
