import { css } from '@emotion/react';
import { theme } from './theme';

export const test = css`
  background-color: blue;
`;

export const redTextHighlight = css`
  color: #d32f2f;
`;

export const greenTextHighlight = css`
  color: #2e7d32;
`;

export const accordionHeadlineStyles = css`
  background-color: ${theme.palette.primary.main};
  color: white;
  border-radius: 4px;
`;