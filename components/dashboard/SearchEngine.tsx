import { useEffect, useState } from 'react';
import { DashboardWidgetProps } from '../../util/types';

export default function SearchEngineWidget(props: DashboardWidgetProps) {
  const [results, setResults] = useState(props.contents);
  console.log('SE props: ', props);

  const displayedContents = props.contents

  useEffect(()=>{
    setResults(displayedContents)
  }, [displayedContents])

  return (
    <section>
      <hr />
      <div>DuckDuckGo search result:</div>
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
