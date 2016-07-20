package org.dicadeveloper.weplantaforest.admin.cart;

import org.dicadeveloper.weplantaforest.admin.support.Uris;
import org.dicadeveloper.weplantaforest.views.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired) )
public class CartController {

    private @NonNull CartRepository _cartRepository;

    @RequestMapping(value = Uris.CARTS, method = RequestMethod.GET)
    @JsonView(Views.OverviewCart.class)
    public Page<Cart> getAllCarts(@RequestParam int page, @RequestParam int size) {
        return _cartRepository.findAllCarts(new PageRequest(page, size));
    }

    @RequestMapping(value = Uris.CHANGE_CART_STATE, method = RequestMethod.POST)
    public ResponseEntity<?> changeCartState(@RequestParam Long cartId, @RequestParam CartState cartState) {
        if (_cartRepository.exists(cartId)) {
            Cart cart = _cartRepository.findOne(cartId);
            cart.setCartState(cartState);
            _cartRepository.save(cart);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

}
