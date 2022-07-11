import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, List, ListItem, ListItemText, Pagination } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { accordionHeadlineStyles } from '../../styles/customStyles';
import { DashboardWidgetProps } from '../../util/types';
import usePagination from './Pagination';

type Content = {
  title: string;
  url: string;
  promptSource: string;
  prediction: number;
};

type Props = {
  contents: Content[];
};

export default function FactCheckToolWidget(props: Props) {
  const [results, setResults] = useState(props.contents);
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(true);

  const displayedContents = props.contents;

  useEffect(() => {
    setResults(displayedContents);
  }, [displayedContents]);

  const perPage = 5;

  useEffect(() => {
    setPaginationCount(Math.ceil(results.length / perPage));
  }, [results]);

  const paginatedData = usePagination(results, perPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    paginatedData.jump(value);
  };

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
            {paginatedData.currentData().map((result) => {
              return (
                <ListItem alignItems="flex-start" key={result.title}>
                  <ListItemText
                    primary={result.title}
                    secondary={
                      <Link href={result.url} target="_blank" rel="noreferrer">
                        {result.url}
                      </Link>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
          <Pagination
            count={paginationCount}
            page={page}
            onChange={handlePageChange}
          />
        </AccordionDetails>
      </Accordion>
    </section>
  );
}
