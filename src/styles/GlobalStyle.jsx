import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import '@fontsource/manrope';
  @import '@fontsource/manrope/700.css';
  @import '@fontsource/manrope/400.css';

  :root {
    --header-height: 60px;
    --header-mobile-height: 100px;
    --bar-height: 73px;
    --sidebar-width: 72px;
    --footer-height: 143px;
    --bottom-nav-height: 58px;
  }

  * {
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Manrope', system-ui;
    letter-spacing: 0.2px;
    background-color: #f5f5f5;
    color: #000;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  textarea, button, input, select {
    font-family: 'Manrope', system-ui;
    font-weight: 400;
    letter-spacing: 0.2px;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  #root {
    height: 100%;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
  }

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
  }

  .page-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-top: calc(var(--header-height) + var(--bar-height));
    margin-left: var(--sidebar-width);
    min-width: 0;
    min-height: 0;
  }

  a {
    all: unset;
    color: inherit;
    cursor: pointer;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 999px) {
    .page-content {
      margin-left: 0;
      margin-top: calc(var(--header-mobile-height) + var(--bar-height));
      min-height: 100%;
    }
  }

  .custom-tooltip {
    max-width: 280px !important;
    white-space: normal !important;
    text-align: left;
  }
`;
