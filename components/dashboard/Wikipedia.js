import { useState } from 'react';

export default function WikipediaWidget(props) {
  const [receivedData, setReceivedData] = useState([]);



  return (
    <section>
      <hr></hr>
      <div>Search results from Wikipedia:</div>
      <div>
        {receivedData ? (
          receivedData.map((entry) => {
            return <div key={entry.pageid}>{entry.title}</div>;
          })
        ) : (
          <div></div>
        )}
      </div>
    </section>
  );
}
