import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { List, ListItem, ListItemText } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { accordionHeadlineStyles } from '../../styles/customStyles';
import { DashboardWidgetProps } from '../../util/types';

export default function WikipediaWidget(props: DashboardWidgetProps) {
  const [results, setResults] = useState(props.contents);

  const displayedContents = props.contents;

  useEffect(() => {
    setResults(displayedContents);
  }, [displayedContents]);

  return (
    <section>
      <Accordion>
        <AccordionSummary
          sx={accordionHeadlineStyles}
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Search results from Wikipedia:</Typography>
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
