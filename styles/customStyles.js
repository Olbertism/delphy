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
` ;

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
