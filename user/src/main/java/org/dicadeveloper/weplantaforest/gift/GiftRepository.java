package org.dicadeveloper.weplantaforest.gift;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface GiftRepository extends CrudRepository<Gift, Long> {

    public final static String FIND_GIFTS_BY_CONSIGNOR = "SELECT gift FROM Gift gift where gift.consignor.name = :userName";

    public final static String FIND_GIFTS_BY_RECIPIENT = "SELECT gift FROM Gift gift where gift.recipient.name = :userName";
    
    public final static String FIND_GIFT_BY_CODE = "SELECT gift from Gift gift where gift.code.code = :codeString";

    @Query(value = FIND_GIFTS_BY_CONSIGNOR)
    public List<Gift> findGiftsByConsignor(@Param("userName") String userName);

    @Query(value = FIND_GIFTS_BY_RECIPIENT)
    public List<Gift> findGiftsByRecipient(@Param("userName") String userName);
    
    @Query(value = FIND_GIFT_BY_CODE)
    public Gift findGiftByCode(@Param("codeString") String codeString);
}
