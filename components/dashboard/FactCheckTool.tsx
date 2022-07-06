import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, List, ListItem, ListItemText } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { accordionHeadlineStyles } from '../../styles/customStyles';
import { DashboardWidgetProps } from '../../util/types';

export default function FactCheckToolWidget(props: DashboardWidgetProps) {
  console.log('fact check tool props: ', props);

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
          <Typography>Google Fact Check Tool results:</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ width: '100%' }}>
            {results.map((result) => {
              return result.map((entry) => {
                return (
                  <ListItem alignItems="flex-start" key={entry.title}>
                    <ListItemText
                      primary={entry.title}
                      secondary={
                        <Link href={entry.url} target="_blank" rel="noreferrer">
                          {entry.url}
                        </Link>
                      }
                    />
                  </ListItem>
                );
              });
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    </section>
  );
}
