import { useEffect, useState } from 'react';
import { DashboardWidgetProps } from '../../util/types';

export default function FactCheckToolWidget(props: DashboardWidgetProps) {
  console.log('fact check tool props: ', props);

  const [results, setResults] = useState(props.contents);

  const displayedContents = props.contents

  useEffect(()=>{
    setResults(displayedContents)
  }, [displayedContents])


  return (
    <section>
      <hr />
      <div>Google Fact Check Tool results:</div>
      <div>
        {results.map((result) => {
          return result.map((entry) =>{
            return (
              <div key={entry.title}>
                <div>{entry.title}</div>
                <div>{entry.url}</div>
              </div>
            );
          })
        })}
      </div>
    </section>
  );
}

/* export function getServerSideProps() {
  return { props: { apiKey: getApiKey() } };
}
 */
