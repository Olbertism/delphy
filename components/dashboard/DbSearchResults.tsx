import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { DashboardWidgetDbSearchResults } from '../../util/types';

type DashboardDbSearchProps = {
  contents: DashboardWidgetDbSearchResults
}
export default function DatabaseWidget(props: DashboardDbSearchProps) {
  const [results, setResults] = useState(props.contents);
  const [expanded, setExpanded] = useState(true);

  const displayedContents = props.contents;

  useEffect(() => {
    setResults(displayedContents);
  }, [displayedContents]);

  const handleExpansion = () => setExpanded(!expanded)

  return (
    <section>
      <Accordion expanded={expanded} onClick={() => handleExpansion()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Search results from Database:</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            {results.length > 0 && (
              <ul className="list-group">
                {results.map((result) => {
                  return (
                    <li key={result.item.id}>
                      <a href={`/database/claims/${result.item.id}`}>{result.item.title} ({Math.round(result.score * 100)}%)</a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </section>
  );
}
