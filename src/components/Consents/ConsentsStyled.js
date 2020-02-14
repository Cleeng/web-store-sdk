import styled from 'styled-components';
import { ErrorColor } from 'styles/variables';

export const ConsentsWrapperStyled = styled.div`
  position: relative;
  font-family: 'Geomanist';
  font-weight: 300;
  margin-top: 30px;

  & button {
    margin-top: 35px;
  }
  & a {
    font-family: 'Geomanist';
    font-weight: 600;
  }
`;

export const ConsentsErrorStyled = styled.div`
  color: ${ErrorColor};
  font-family: 'Geomanist';
  font-size: 13px;
  width: 100%;
  position: absolute;
  bottom: -21px;
`;
