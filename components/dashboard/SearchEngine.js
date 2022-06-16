import { useEffect, useState } from 'react';
import { makeFactCheckToolRequest } from '../../util/fetchers/factCheckToolFetcher';
import { makeDuckDuckGoInstantAnswerRequest } from '../../util/fetchers/searchEngineFetcher';

export default function SearchEngineWidget(props) {
  const [receivedData, setReceivedData] = useState([]);
  console.log('SE props: ', props);

  useEffect(() => {
    async function getData() {
      // const searchData = await makeDuckDuckGoInstantAnswerRequest(props.query);
      // const searchData = await makeFactCheckToolRequest(props.query);
      // console.log(searchData);

      const params = {
        query: props.query,
      };

      const data = await fetch(
        '/api/duckDuckGo?' + new URLSearchParams(params).toString(),
      );
      //console.log(data);
      const results = await data.json();
      console.log(results);
      setReceivedData(results);
    }
    if (props.query) {
      getData().catch(() => {});
    }
  }, [props.query]);

  return (
    <section>
      <hr></hr>
      <div>Placeholder for Search Engine Results results</div>
      {receivedData.Abstract}
    </section>
  );
}
