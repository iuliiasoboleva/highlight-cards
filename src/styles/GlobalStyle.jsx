import { createGlobalStyle } from 'styled-components';

import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';

export const GlobalStyle = createGlobalStyle`
  :root {
    --header-height: 83px;
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

  a, button, [role="button"], input, select, textarea, div {
    -webkit-tap-highlight-color: transparent;
  }

  @media (hover: none) and (pointer: coarse) {
    a, button, [role="button"], input, select, textarea { outline: none; }
  }

  form {
    display: flex;
    flex-direction: column;
  }

  .react-datepicker {
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 8px;
  }

  .react-datepicker::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 30px;
    width: 16px;
    height: 16px;
    background: #fff;
    transform: rotate(45deg);
    box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.04);
    z-index: 1;
  }

  .react-datepicker__header {
    background-color: #fff;
    border-bottom: none;
    padding-top: 8px;
  }

  .react-datepicker__current-month {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }

  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    margin: 2px;
    border-radius: 8px;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #6a30ff;
    color: #fff;
  }

  .react-datepicker__day:hover {
    background-color: #f0f0f0;
  }

  .react-datepicker__day--disabled {
    color: #ccc;
  }

  .react-datepicker__navigation {
    top: 10px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #333;
    border-width: 2px 2px 0 0;
  }

  .react-datepicker__triangle {
    display: none;
  }

  @media (max-width: 999px) {
    .page-content {
      margin-left: 0;
      min-height: 100%;
      margin-top: auto;
    }
  }
`;
