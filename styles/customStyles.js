import { css } from '@emotion/react';
import { theme } from './theme';

export const tableHeaderStyles = css`
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.neutral.light}!important;

  th:active {
    color: ${theme.palette.secondary.main};
  }

  th:hover {
    color: ${theme.palette.secondary.main};
  }

  th:focus {
    color: ${theme.palette.secondary.main};
  }

  th:target {
    color: ${theme.palette.secondary.main};
  }

  span:active {
    color: ${theme.palette.secondary.main};
  }

  span:hover {
    color: ${theme.palette.secondary.main}!important;
  }

  span:focus {
    color: ${theme.palette.secondary.main}!important;
  }

  span:target {
    color: ${theme.palette.secondary.main};
  }

  svg:active {
    color: ${theme.palette.secondary.main}!important;
  }

  svg:hover {
    color: ${theme.palette.secondary.main}!important;
  }

  svg:focus {
    color: ${theme.palette.secondary.main}!important;
  }
  svg:focus-visible {
    color: ${theme.palette.secondary.main}!important;
  }
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

export const labelStyles = css`
  background-color: ${theme.palette.primary.main};
  color: white;
  justify-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
  display: inline-block;
`;

export const cardListItem = css`
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.neutral.light};
  margin-bottom: 5px;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  svg {
    color: ${theme.palette.neutral.main};
  }
  a {
    color: ${theme.palette.secondary.light};
    text-decoration-color: ${theme.palette.secondary.light};
  }
`;

export const landingPageBackground = css`
  .background {
    position: relative;
    height: 100vh;
    background-color: #4f5b62;
  }

  .background::before {
    content: '';
    background-image: url('/polygons.svg');
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.2;
  }

  .contentWrapper {
    position: relative;
    top: 20%;
    margin-left: auto;
    margin-right: auto;

    @media only screen and (max-width: 720px) {
      width: 80%;
    }
  }

  .hero {
    position: relative;
    margin-bottom: 8vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
  }

  .teaser {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
  }
`;
