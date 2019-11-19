import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CouponInput from 'components/CouponInput/CouponInput';
import { MESSAGE_TYPE_FAIL, MESSAGE_TYPE_SUCCESS } from 'components/Input';
import Payment from 'components/Payment/Payment';

import {
  StyledOfferBody,
  StyledOfferWrapper,
  StyledPageTitle,
  StyledOfferContent,
  StyledImageUrl,
  StyledOfferDetailsAndCoupon,
  StyledOfferDetailsWrapper,
  StyledOfferTitle,
  StyledOfferDetails,
  StyledOfferDescription,
  StyledOfferDetailsPrice,
  StyledTrial,
  StyledPrice,
  StyledTotalWrapper,
  StyledPriceBeforeWrapper,
  StyledTrialDescription,
  StyledTotalLabel,
  StyledOfferPrice,
  StyledCouponDiscountWrapper,
  StyledPriceWrapper
} from './OfferStyled';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const roundPrice = value => Math.round(value * 100) / 100;

class Offer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coupon: ''
    };
  }

  render() {
    const {
      offerDetails: {
        title,
        description,
        imageUrl,
        price,
        priceBeforeDiscount,
        customerCurrencySymbol,
        isCouponApplied,
        isTrialAllowed,
        freePeriods,
        periodDescription
      },
      couponProps: { showMessage, message, messageType, onSubmit },
      onPaymentComplete
    } = this.props;
    const { coupon } = this.state;
    return (
      <StyledOfferWrapper>
        <StyledOfferBody>
          <Header />
          <StyledPageTitle>Complete your purchase</StyledPageTitle>
          <StyledOfferContent>
            <StyledImageUrl src={imageUrl} alt="Offer" />
            <StyledOfferDetailsAndCoupon>
              <StyledOfferDetailsWrapper>
                <StyledOfferTitle>{title}</StyledOfferTitle>
                <StyledOfferDetails>
                  <StyledOfferDescription>
                    {isTrialAllowed && (
                      <StyledTrialDescription>
                        {`You will be charged ${customerCurrencySymbol}${price} after ${freePeriods} ${periodDescription}.`}
                      </StyledTrialDescription>
                    )}
                    {description}
                  </StyledOfferDescription>
                  <StyledOfferDetailsPrice>
                    {isTrialAllowed && <StyledTrial>trial period</StyledTrial>}
                    <StyledPrice>
                      {`${customerCurrencySymbol}${price} `}
                      <span>exVAT</span>
                    </StyledPrice>
                  </StyledOfferDetailsPrice>
                </StyledOfferDetails>
              </StyledOfferDetailsWrapper>
              <CouponInput
                showMessage={showMessage}
                message={message}
                messageType={messageType}
                onSubmit={onSubmit}
                value={coupon}
                onChange={e => this.setState({ coupon: e })}
              />
            </StyledOfferDetailsAndCoupon>
          </StyledOfferContent>
          <StyledTotalWrapper>
            {isCouponApplied && (
              <>
                <StyledPriceBeforeWrapper>
                  <StyledTotalLabel>Price:</StyledTotalLabel>
                  <StyledOfferPrice>
                    {`${customerCurrencySymbol}${priceBeforeDiscount} `}
                    <span>exVAT</span>
                  </StyledOfferPrice>
                </StyledPriceBeforeWrapper>
                <StyledCouponDiscountWrapper>
                  <StyledTotalLabel>Coupon Discount</StyledTotalLabel>
                  <StyledOfferPrice>
                    {`${customerCurrencySymbol}${roundPrice(
                      priceBeforeDiscount - price
                    )}`}
                  </StyledOfferPrice>
                </StyledCouponDiscountWrapper>
              </>
            )}
            <StyledPriceWrapper>
              <StyledTotalLabel>Total</StyledTotalLabel>
              <StyledOfferPrice>
                {`${customerCurrencySymbol}${price} `}
                <span>exVAT</span>
              </StyledOfferPrice>
            </StyledPriceWrapper>
          </StyledTotalWrapper>
        </StyledOfferBody>
        <Payment onPaymentComplete={onPaymentComplete} />
        <Footer />
      </StyledOfferWrapper>
    );
  }
}

Offer.propTypes = {
  offerDetails: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number,
    priceBeforeDiscount: PropTypes.number,
    customerCurrencySymbol: PropTypes.string,
    isCouponApplied: PropTypes.bool,
    isTrialAllowed: PropTypes.bool,
    freePeriods: PropTypes.number,
    periodDescription: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  couponProps: PropTypes.shape({
    showMessage: PropTypes.bool,
    message: PropTypes.node,
    messageType: PropTypes.oneOf([MESSAGE_TYPE_FAIL, MESSAGE_TYPE_SUCCESS]),
    onSubmit: PropTypes.func.isRequired
  }),
  onPaymentComplete: PropTypes.func.isRequired
};

Offer.defaultProps = { couponProps: null };

export default Offer;
