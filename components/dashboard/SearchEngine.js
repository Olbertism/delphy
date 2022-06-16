import { useEffect, useState } from 'react';
import { makeDuckDuckGoInstantAnswerRequest } from '../../util/fetchers/searchEngineFetcher';

export default function SearchEngineWidget(props) {
  const [receivedData, setReceivedData] = useState([]);
  console.log('SE props: ', props);

  useEffect(() => {
    async function getData() {
      const searchData = await makeDuckDuckGoInstantAnswerRequest(props.query);
      console.log(searchData.Abstract);
      setReceivedData(searchData.Abstract);
    }
    if (props.query) {
      getData();
    }
  }, [props.query]);

  return (
    <section>
      <hr></hr>
      <div>Placeholder for Search Engine Results results</div>
      {receivedData}
    </section>
  );
}
