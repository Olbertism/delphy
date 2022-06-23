import { useEffect, useState } from 'react';

export default function NewsWidget(props) {
  const [receivedData, setReceivedData] = useState([]);
  console.log('News props: ', props);

  return (
    <section>
      <hr></hr>
      <div>News Api results:</div>
      <div>
        {receivedData.map((entry) => {
          return (<div key={entry.id}><div>{entry.webTitle}</div>
                  <div>{entry.webUrl}</div></div>)
        })}
      </div>
    </section>
  );
}
