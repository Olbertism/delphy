import { useEffect, useState } from 'react';

export default function FactCheckToolWidget(props) {
  console.log('fact check tool props: ', props);

  const [receivedData, setReceivedData] = useState([]);

  useEffect(() => {
    async function getData() {
      console.log('calling get Data with query props: ', props.query);
      const params = {
        query: props.query,
      };

      const data = await fetch(
        '/api/factCheckTool?' + new URLSearchParams(params).toString(),
        /* new URLSearchParams({
          query: props.query,
        }), */
      );
      const results = await data.json();
      console.log(results);
      setReceivedData(results.claims);
    }
    if (props.query) {
      getData().catch(() => {});
    }
  }, [props.query]);

  return (
    <section>
      <hr></hr>
      <div>Google Fact Check Tool results:</div>
      <div>
        {receivedData ? (
          receivedData.map((entry) => {
            return (
              <div key={entry.text}>
                Claim:
                <div>{entry.text}</div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </section>
  );
}

/* export function getServerSideProps() {
  return { props: { apiKey: getApiKey() } };
}
 */
