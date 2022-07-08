import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Link } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { accordionHeadlineStyles } from '../../styles/customStyles';
import { DashboardWidgetDbSearchResults } from '../../util/types';

type DashboardDbSearchProps = {
  contents: DashboardWidgetDbSearchResults;
};
export default function DatabaseWidget(props: DashboardDbSearchProps) {
  const [results, setResults] = useState(props.contents);
  const [expanded, setExpanded] = useState(true);

  const displayedContents = props.contents;

  useEffect(() => {
    setResults(displayedContents);
  }, [displayedContents]);

  const handleExpansion = () => setExpanded(!expanded);

  return (
    <section>
      <Accordion expanded={expanded}>
        <AccordionSummary
          onClick={() => handleExpansion()}
          sx={accordionHeadlineStyles}
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Search results from Database:</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            {results.length > 0 ? (
              <ul className="list-group">
                {results.map((result) => {
                  return (
                    <li key={result.item.id}>
                      <a href={`/database/claims/${result.item.id}`}>
                        {result.item.title} ({Math.round(result.score * 100)}%)
                      </a>
                    </li>
                  );
                })}
              </ul>
            ): <Typography>No results from database</Typography>}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              href="/database"
              variant="contained"
              color="secondary"
              size="small"
            >
              Go to Database
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </section>
  );
}
