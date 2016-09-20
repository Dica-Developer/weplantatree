package org.dicadeveloper.weplantaforest.payment;

import org.dicadeveloper.weplantaforest.cart.Cart;
import org.dicadeveloper.weplantaforest.cart.CartRepository;
import org.dicadeveloper.weplantaforest.support.Uris;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired) )
public class PaymentController {

    private @NonNull PaymentHelper _paymentHelper;

    private @NonNull CartRepository _cartRepository;

    @RequestMapping(value = Uris.PAY_PLANTBAG, method = RequestMethod.POST)
    public ResponseEntity<?> payPlantBag(@RequestBody PaymentData paymentData) {
        Cart cartToPay = _cartRepository.findOne(paymentData.getCartId());
        String paymentRequestResponse = _paymentHelper.postRequest(cartToPay, paymentData);

        if (_paymentHelper.isSuccessFull(paymentRequestResponse)) {
            cartToPay.setCallBackValuesAndStateToCallBack(paymentData);
            _cartRepository.save(cartToPay);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            String paymentErrorMessage = _paymentHelper.getErrorMessageForCode(paymentRequestResponse);
            return new ResponseEntity<String>(paymentErrorMessage, HttpStatus.BAD_REQUEST);
        }
    }

}