/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import labeling from 'containers/labeling';

import { ReactComponent as noSubscriptionsIcon } from 'assets/images/errors/sad_coupon.svg';
import { dateFormat, currencyFormat } from 'util/planHelper';

import MyAccountError from 'components/MyAccountError';
import SubscriptionCard from 'components/SubscriptionCard';
import SubscriptionManagement from 'components/SubscriptionManagement';
import CouponInput from 'components/CouponInput';
import MessageBox from 'components/MessageBox';
import { applyCoupon } from 'api';

import {
  WrapStyled,
  SubscriptionStyled,
  SubscriptionActionsStyled,
  FullWidthButtonStyled,
  SimpleButtonStyled,
  CouponWrapStyled,
  StatusMessageWrapStyled
} from './CurrentPlanStyled';

export const SkeletonCard = () => {
  return (
    <SubscriptionStyled>
      <SubscriptionCard isDataLoaded={false} />
    </SubscriptionStyled>
  );
};

class CurrentPlan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMessageBoxOpened: false,
      messageBoxType: null,
      messageBoxText: '',
      isErrorMessageShown: false,
      errorMessage: '',
      isCouponInputOpened: false,
      couponValue: '',
      isSubmitting: false,
      messageSubscriptionId: null
    };
  }

  submitCoupon = subscriptionId => {
    const { t, updateList } = this.props;
    const { couponValue } = this.state;

    this.resetErrorMessage();

    if (couponValue) {
      this.setState({ isSubmitting: true });
      applyCoupon(subscriptionId, couponValue)
        .then(resp => {
          switch (resp.status) {
            case 200:
              this.showMessageBox(
                'success',
                t('Your Coupon has been successfully reedemed.'),
                subscriptionId
              );
              this.setState({
                isCouponInputOpened: false,
                isSubmitting: false
              });
              updateList();
              break;
            case 422:
              if (resp.errors.some(e => e.includes('not found')))
                this.showErrorMessage(t('Invalid coupon code.'));
              if (resp.errors.some(e => e.includes('already')))
                this.showErrorMessage(t('Coupon already used'));
              this.setState({
                isSubmitting: false
              });
              break;
            default:
              this.showErrorMessage(t('Invalid coupon code.'));
              this.setState({
                isSubmitting: false
              });
              break;
          }
        })
        .catch(() => {
          this.showErrorMessage('Ooops. Something went wrong.');
          this.setState({
            isSubmitting: false
          });
        });
    } else {
      this.showErrorMessage(t('Please enter coupon code.'));
    }
  };

  onInputToggle = () => {
    this.setState({
      isCouponInputOpened: true
    });
  };

  resetErrorMessage = () => {
    this.setState({
      isErrorMessageShown: false
    });
  };

  showErrorMessage = message => {
    this.setState({
      isErrorMessageShown: true,
      errorMessage: message
    });
  };

  showMessageBox = (type, text, subscriptionId) => {
    this.setState({
      messageBoxType: type,
      messageBoxText: text,
      isMessageBoxOpened: true,
      messageSubscriptionId: subscriptionId
    });
  };

  render() {
    const {
      isMessageBoxOpened,
      isCouponInputOpened,
      isErrorMessageShown,
      messageBoxType,
      messageBoxText,
      errorMessage,
      couponValue,
      isSubmitting,
      messageSubscriptionId
    } = this.state;

    const {
      subscriptions,
      isLoading,
      errors,
      showInnerPopup,
      setOfferToSwitch,
      offerToSwitch,
      isManagementBarOpen,
      t
    } = this.props;

    const areFewOffers = subscriptions.length > 1;
    return isLoading ? (
      <SkeletonCard />
    ) : (
      <WrapStyled>
        {errors.length !== 0 ? (
          <MyAccountError generalError />
        ) : subscriptions.length === 0 ? (
          <MyAccountError
            title={t('No subscriptions yet!')}
            subtitle={t(
              'If you choose your plan, you will be able to manage your Subscriptions here.'
            )}
            icon={noSubscriptionsIcon}
          />
        ) : (
          <>
            {subscriptions.map(subItem => {
              const description = `${
                subItem.status === 'active'
                  ? t('Next payment is on')
                  : t('This plan will expire on')
              } ${dateFormat(subItem.expiresAt)}`;
              return (
                <SubscriptionStyled
                  key={subItem.offerId}
                  onClick={() => {
                    if (areFewOffers && subItem.status === 'active')
                      setOfferToSwitch(subItem);
                  }}
                  cursorPointer={areFewOffers && subItem.status === 'active'}
                  isSelected={
                    areFewOffers && offerToSwitch.offerId === subItem.offerId
                  }
                >
                  <SubscriptionCard
                    period={subItem.period}
                    title={subItem.offerTitle}
                    description={description}
                    currency={currencyFormat[subItem.nextPaymentCurrency]}
                    price={subItem.nextPaymentPrice}
                  />
                  {isMessageBoxOpened &&
                    messageSubscriptionId === subItem.subsctiptionId && (
                      <StatusMessageWrapStyled>
                        <MessageBox
                          type={messageBoxType}
                          message={messageBoxText}
                        />
                      </StatusMessageWrapStyled>
                    )}
                  <SubscriptionManagement
                    isOpened={isManagementBarOpen}
                    onClose={() =>
                      this.setState({ isCouponInputOpened: false })
                    }
                  >
                    <SubscriptionActionsStyled>
                      {subItem.status === 'active' && !isCouponInputOpened && (
                        <SimpleButtonStyled
                          theme="simple"
                          onClickFn={event => {
                            event.stopPropagation();
                            showInnerPopup({
                              type: 'updateSubscription',
                              data: {
                                action: 'unsubscribe',
                                offerData: {
                                  offerId: subItem.offerId,
                                  expiresAt: subItem.expiresAt
                                }
                              }
                            });
                          }}
                        >
                          {t('Unsubscribe')}
                        </SimpleButtonStyled>
                      )}
                      {subItem.status === 'cancelled' && !isCouponInputOpened && (
                        <FullWidthButtonStyled
                          theme="simple"
                          onClickFn={event => {
                            event.stopPropagation();
                            showInnerPopup({
                              type: 'updateSubscription',
                              data: {
                                action: 'resubscribe',
                                offerData: {
                                  offerId: subItem.offerId,
                                  expiresAt: subItem.expiresAt,
                                  price: `${subItem.nextPaymentPrice}${
                                    currencyFormat[subItem.nextPaymentCurrency]
                                  }`
                                }
                              }
                            });
                          }}
                        >
                          {t('Resume')}
                        </FullWidthButtonStyled>
                      )}
                      {subItem.status !== 'cancelled' && (
                        <CouponWrapStyled>
                          <CouponInput
                            fullWidth
                            showMessage={isErrorMessageShown}
                            value={couponValue}
                            message={errorMessage}
                            couponLoading={isSubmitting}
                            onSubmit={() =>
                              this.submitCoupon(subItem.subscriptionId)
                            }
                            onChange={e => this.setState({ couponValue: e })}
                            onClose={() =>
                              this.setState({ isCouponInputOpened: false })
                            }
                            onInputToggle={() => this.onInputToggle()}
                          />
                        </CouponWrapStyled>
                      )}
                    </SubscriptionActionsStyled>
                  </SubscriptionManagement>
                </SubscriptionStyled>
              );
            })}
          </>
        )}
      </WrapStyled>
    );
  }
}

CurrentPlan.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.any),
  isLoading: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.any),
  showInnerPopup: PropTypes.func.isRequired,
  setOfferToSwitch: PropTypes.func.isRequired,
  offerToSwitch: PropTypes.objectOf(PropTypes.any),
  updateList: PropTypes.func.isRequired,
  isManagementBarOpen: PropTypes.bool,
  t: PropTypes.func
};

CurrentPlan.defaultProps = {
  subscriptions: [],
  isLoading: false,
  errors: [],
  offerToSwitch: {},
  isManagementBarOpen: false,
  t: k => k
};

export { CurrentPlan as PureCurrentPlan };

export default withTranslation()(labeling()(CurrentPlan));
