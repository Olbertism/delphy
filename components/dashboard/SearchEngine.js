import { useEffect, useState } from 'react';

export default function SearchEngineWidget(props) {
  const [receivedData, setReceivedData] = useState([]);
  console.log('SE props: ', props);

/*   useEffect(() => {
    async function getData() {

      const params = {
        query: props.query,
      };

      const data = await fetch(
        '/api/duckDuckGo?' + new URLSearchParams(params).toString(),
      );

      const results = await data.json();
      console.log(results);
      setReceivedData(results);
    }
    if (props.query) {
      getData().catch(() => {});
    }
  }, [props.query]); */

  return (
    <section>
      <hr></hr>
      <div>DuckDuckGo Instant Answer result:</div>
      {receivedData.Abstract}
    </section>
  );
}
