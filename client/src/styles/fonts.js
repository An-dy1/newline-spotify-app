import { css } from 'styled-components/macro';

const fonts = css`
  @font-face {
    font-family: 'Raleway';
    src: url('../fonts/Raleway-Regular.ttf') format('truetype'),
      url('../fonts/Raleway-Regular.tff') format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Raleway';
    src: url('../fonts/Raleway-Bold.ttf') format('truetype'),
      url('../fonts/Raleway-Bold.tff') format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'Raleway';
    src: url('../fonts/Raleway-Black.ttf') format('truetype'),
      url('../fonts/Raleway-Black.tff') format('truetype');
    font-weight: 900;
    font-style: normal;
  }
`;

export default fonts;
