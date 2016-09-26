package org.dicadeveloper.weplantaforest.payment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentData {
    
    Long cartId;

    String company;
    String companyAddon;
    
    String salutation;
    String title;
    String forename;
    String name;
    
    String street;
    String country;
    String city;
    String zip;
    String mail;
    
    String receipt;
    String comment;
    
    String paymentMethod;
    String iban;
    String bic;
    
}