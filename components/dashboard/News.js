import { useEffect, useState } from 'react';

export default function NewsWidget(props) {
  const [receivedData, setReceivedData] = useState([]);
  console.log('SE props: ', props);

/*   useEffect(() => {
    async function getData() {

      const params = {
        query: props.query,
      };

      const data = await fetch(
        '/api/guardianSearch?' + new URLSearchParams(params).toString(),
      );

      const results = await data.json();
      console.log(results);
      setReceivedData(results.response.results);
    }
    if (props.query) {
      getData().catch(() => {});
    }
  }, [props.query]); */

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
