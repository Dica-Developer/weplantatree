package org.dicadeveloper.weplantaforest.payment;

import org.dicadeveloper.weplantaforest.cart.Cart;
import org.dicadeveloper.weplantaforest.cart.CartRepository;
import org.dicadeveloper.weplantaforest.cart.CartState;
import org.dicadeveloper.weplantaforest.gift.Gift;
import org.dicadeveloper.weplantaforest.gift.Gift.Status;
import org.dicadeveloper.weplantaforest.gift.GiftRepository;
import org.dicadeveloper.weplantaforest.messages.MessageByLocaleService;
import org.dicadeveloper.weplantaforest.support.Uris;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired) )
public class PaymentController {

    private @NonNull PaymentHelper _paymentHelper;

    private @NonNull CartRepository _cartRepository;

    private @NonNull GiftRepository _giftRepository;

    private @NonNull MessageByLocaleService _messageByLocaleService;

    @RequestMapping(value = Uris.PAY_PLANTBAG, method = RequestMethod.POST)
    public ResponseEntity<?> payPlantBag(@RequestBody PaymentData paymentData) {
        Cart cartToPay = _cartRepository.findOne(paymentData.getCartId());
        String paymentRequestResponse = _paymentHelper.postRequestSepa(cartToPay, paymentData);
        String paymentErrorMessage;
        if (_paymentHelper.isSuccessFull(paymentRequestResponse)) {
            cartToPay.setCallBackValuesAndStateToCallBack(paymentData);
            _cartRepository.save(cartToPay);
            if (paymentData.getGiftId() != null) {
                Gift giftToPay = _giftRepository.findOne(paymentData.getGiftId());
                giftToPay.setStatus(Status.UNREDEEMED);
                _giftRepository.save(giftToPay);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else if (_paymentHelper.isConnectionError(paymentRequestResponse)) {
            paymentErrorMessage = _messageByLocaleService.getMessage("sozialbank.connection.error", cartToPay.getBuyer().getLang().getLocale());
            return new ResponseEntity<String>(paymentErrorMessage, HttpStatus.BAD_REQUEST);
        } else if (_paymentHelper.isUndefinedError(paymentRequestResponse)) {
            paymentErrorMessage = _messageByLocaleService.getMessage("sozialbank.undefined.error", cartToPay.getBuyer().getLang().getLocale());
            return new ResponseEntity<String>(paymentErrorMessage, HttpStatus.BAD_REQUEST);
        } else {
            String errorCode = _paymentHelper.getErrorCode(paymentRequestResponse);
            paymentErrorMessage = _messageByLocaleService.getMessage("sozialbank." + errorCode, cartToPay.getBuyer().getLang().getLocale());
            return new ResponseEntity<String>(paymentErrorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = Uris.VALIDATE_CC_DATA, method = RequestMethod.POST)
    public ResponseEntity<?> validatePlantBagCC(@RequestBody PaymentData paymentData) {
        Cart cartToPay = _cartRepository.findOne(paymentData.getCartId());
        String paymentRequestResponse = _paymentHelper.postRequestCC(cartToPay, paymentData);
        String paymentErrorMessage;
        if (_paymentHelper.isSuccessFullCC(paymentRequestResponse)) {
            cartToPay.setCallBackValues(paymentData);
            _cartRepository.save(cartToPay);
            return new ResponseEntity<>(HttpStatus.OK);
        } else if (_paymentHelper.isConnectionError(paymentRequestResponse)) {
            paymentErrorMessage = _messageByLocaleService.getMessage("sozialbank.connection.error", cartToPay.getBuyer().getLang().getLocale());
            return new ResponseEntity<String>(paymentErrorMessage, HttpStatus.BAD_REQUEST);
        }  else if (_paymentHelper.isUndefinedError(paymentRequestResponse)) {
            paymentErrorMessage = _messageByLocaleService.getMessage("sozialbank.undefined.error", cartToPay.getBuyer().getLang().getLocale());
            return new ResponseEntity<String>(paymentErrorMessage, HttpStatus.BAD_REQUEST);
        }else {
            String errorCode = _paymentHelper.getErrorCode(paymentRequestResponse);
            paymentErrorMessage = _messageByLocaleService.getMessage("sozialbank." + errorCode, cartToPay.getBuyer().getLang().getLocale());
            return new ResponseEntity<String>(paymentErrorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = Uris.SUBMIT_CC_PAYED_PLANTBAG, method = RequestMethod.POST)
    public ResponseEntity<?> submitCCpayedPlantBag(@RequestParam long cartId) {
        Cart cartToSubmit = _cartRepository.findOne(cartId);
        if (cartToSubmit != null) {
            cartToSubmit.setCartState(CartState.CALLBACK);
            _cartRepository.save(cartToSubmit);
            if (cartToSubmit.getCode() != null) {
                Gift giftToSubmit = _giftRepository.findGiftByCode(cartToSubmit.getCode().getCode());
                giftToSubmit.setStatus(Status.UNREDEEMED);
                _giftRepository.save(giftToSubmit);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

}
