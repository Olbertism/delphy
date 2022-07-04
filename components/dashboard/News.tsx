import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { DashboardWidgetProps } from '../../util/types';

export default function NewsWidget(props: DashboardWidgetProps) {
  const [results, setResults] = useState(props.contents);
  console.log('News props: ', props);
  console.log("results", results)

  const displayedContents = props.contents

  useEffect(()=>{
    setResults(displayedContents)
  }, [displayedContents])

  return (
    <section>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Recent news results:</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component='div'>
            {results.map((result) => {
              return result.map((entry) => {
                return (
                  <div key={entry.title}>
                    <div>{entry.title}</div>
                    <div>{entry.url}</div>
                  </div>
                );
              });
            })}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </section>
  );
}
