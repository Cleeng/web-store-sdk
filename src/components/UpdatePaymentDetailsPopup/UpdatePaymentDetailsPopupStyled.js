/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { LineColor, MainColor } from 'styles/variables';
import { ReactComponent as PPIcon } from 'assets/images/paymentMethods/paypal_short.svg';

export const PaymentMethodStyled = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 350px;
  margin: auto auto 15px auto;
  padding: 30px;

  border: 1px solid ${LineColor};
  border-radius: 12px;
  background: transparent;

  color: ${MainColor};
  text-align: left;
  cursor: pointer;
  &:active {
    border: 1px solid ${LineColor};
  }
  &:hover {
    border: 1px solid ${MainColor};
  }
`;

export const PaymentMethodTextStyled = styled.div`
  margin-left: 20px;
`;

export const PaymentMethodTitleStyled = styled.div`
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
  width: 100%;
`;

export const PaymentMethodDescStyled = styled.div`
  font-weight: 300;
  font-size: 12px;
`;
export const PaymentMethodIconStyled = styled.div`
  path {
    fill: ${MainColor};
  }
`;

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin: 0 auto 40px auto;
`;

export const PPIconStyled = styled(props => <PPIcon {...props} />)`
  margin-right: 10px;
  filter: brightness(0) invert(1);
`;
