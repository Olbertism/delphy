import { useEffect, useState } from 'react';
import { makeWikiSearchRequest } from '../../util/fetchers/wikiFetcher';

export default function WikipediaWidget(props) {
  const [receivedData, setReceivedData] = useState([]);

  useEffect(() => {
    async function getData() {
      const searchData = await makeWikiSearchRequest(props.query);
      console.log(searchData.query.search);
      setReceivedData(searchData.query.search);
    }
    if (props.query) {
      getData();
    }
  }, [props.query]);

  return (
    <section>
      <hr></hr>
      <div>Placeholder for Wiki results</div>
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
