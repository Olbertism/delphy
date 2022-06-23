import { useEffect, useState } from 'react';

export default function FactCheckToolWidget(props) {
  console.log('fact check tool props: ', props);

  const [receivedData, setReceivedData] = useState([]);


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
