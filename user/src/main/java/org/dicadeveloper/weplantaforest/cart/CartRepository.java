package org.dicadeveloper.weplantaforest.cart;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends CrudRepository<Cart, Long> {

    public final static String FIND_CARTS_BUY_USER_ID = "SELECT cart from Cart cart where cart.buyer.id = :userId";
    
    public final static String FIND_VERIFIED_CARTS_BUY_USER_ID = "SELECT cart from Cart cart where cart.buyer.id = :userId AND cart.cartState = \'VERIFIED\'";
    
    public final static String FIND_CART_BY_CODE = "SELECT cart from Cart cart WHERE cart.code.code = :codeString";
    
    
    //14400000 --> older than 4 hours
    public final static String FIND_INITIAL_CARTS_OLDER_THAN_FOUR_HOURS = "SELECT cart FROM Cart cart WHERE ((:time - cart.timeStamp) > 14400000) AND cart.cartState = \'INITIAL\'";

    public List<Cart> findCartsByIdIn(@Param("id") Long[] ids);

    @Query(value = FIND_CARTS_BUY_USER_ID)
    public List<Cart> findCartsByUserId(@Param("userId") long userId);
    
    @Query(value = FIND_VERIFIED_CARTS_BUY_USER_ID)
    public List<Cart> findVerifiedCartsByUserId(@Param("userId") long userId);
    
    @Query(value = FIND_CART_BY_CODE)
    public Cart findCartByCode(@Param("codeString") String codeString);
    
    @Query(value = FIND_INITIAL_CARTS_OLDER_THAN_FOUR_HOURS)
    public List<Cart> findInitialCartsOlderThanFourHours(@Param("time") long timeOfMeasurement);

}
