import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { accordionHeadlineStyles } from '../../styles/customStyles';
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
      {props.contents.length === 0 ? <div /> :
      <Accordion>
        <AccordionSummary
        sx={accordionHeadlineStyles}
          expandIcon={<ExpandMoreIcon color="secondary"/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>DuckDuckGo search result:</Typography>
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
      </Accordion>}
    </section>
  );
}
