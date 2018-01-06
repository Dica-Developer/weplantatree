package org.dicadeveloper.weplantaforest.payment;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.cart.Cart;
import org.dicadeveloper.weplantaforest.cart.CartRepository;
import org.dicadeveloper.weplantaforest.common.errorHandling.ErrorCodes;
import org.dicadeveloper.weplantaforest.common.errorHandling.IpatException;
import org.dicadeveloper.weplantaforest.common.errorHandling.IpatPreconditions;
import org.dicadeveloper.weplantaforest.gift.Gift;
import org.dicadeveloper.weplantaforest.gift.Gift.Status;
import org.dicadeveloper.weplantaforest.gift.GiftRepository;
import org.dicadeveloper.weplantaforest.messages.MessageByLocaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PaymentService {

    protected final Log LOG = LogFactory.getLog(PaymentService.class.getName());

    private @NonNull PaymentHelper _paymentHelper;

    private @NonNull CartRepository _cartRepository;

    private @NonNull GiftRepository _giftRepository;

    private @NonNull MessageByLocaleService _messageByLocaleService;

    public void payPlantBag(PaymentData paymentData) throws IpatException {
        switch (paymentData.getPaymentMethod()) {
        case "SEPA":
            payViaSepa(paymentData);
            break;
        case "PP":
            submitPaypalOrCreditCardPayedPlantbag(paymentData);
            break;
        case "KK":
            submitPaypalOrCreditCardPayedPlantbag(paymentData);
            break;
        default:
            break;
        }
    }

    private void payViaSepa(PaymentData paymentData) throws IpatException {
        Cart cartToPay = _cartRepository.findOne(paymentData.getCartId());
        IpatPreconditions.checkNotNull(cartToPay, ErrorCodes.CART_IS_NULL);
        String paymentRequestResponse = _paymentHelper.postRequestSepa(cartToPay, paymentData);
        IpatPreconditions.checkArgument(!_paymentHelper.isConnectionError(paymentRequestResponse), ErrorCodes.BANK_CONNECTION_ERROR);
        IpatPreconditions.checkArgument(!_paymentHelper.isUndefinedError(paymentRequestResponse), ErrorCodes.BANK_UNDEFINED_ERROR);
        if (_paymentHelper.isSuccessFull(paymentRequestResponse)) {
            cartToPay.setCallBackValuesAndStateToCallBack(paymentData);
            _cartRepository.save(cartToPay);
            if (paymentData.getGiftId() != null) {
                Gift giftToPay = _giftRepository.findOne(paymentData.getGiftId());
                giftToPay.setStatus(Status.UNREDEEMED);
                _giftRepository.save(giftToPay);
            }
        } else {
            String errorCode = _paymentHelper.getErrorCode(paymentRequestResponse);
            throw new IpatException(PaymentHelper.BANK_ERRORS.get("BANK_" + errorCode));
        }
    }

    private void submitPaypalOrCreditCardPayedPlantbag(PaymentData paymentData) throws IpatException {
        Cart cartToSubmit = _cartRepository.findOne(paymentData.getCartId());
        IpatPreconditions.checkNotNull(cartToSubmit, ErrorCodes.CART_IS_NULL);
        cartToSubmit.setCallBackValuesAndStateToCallBack(paymentData);
        _cartRepository.save(cartToSubmit);
        if (cartToSubmit.getCode() != null) {
            Gift giftToSubmit = _giftRepository.findGiftByCode(cartToSubmit.getCode().getCode());
            giftToSubmit.setStatus(Status.UNREDEEMED);
            _giftRepository.save(giftToSubmit);
        }
    }

}
