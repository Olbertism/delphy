import { useEffect, useState } from 'react';

export default function SearchEngineWidget(props) {
  const [receivedData, setReceivedData] = useState([]);
  console.log('SE props: ', props);

  return (
    <section>
      <hr></hr>
      <div>DuckDuckGo Instant Answer result:</div>
      {receivedData.Abstract}
    </section>
  );
}
