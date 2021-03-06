package org.dicadeveloper.weplantaforest.projects.offer;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectOfferData {

    String first;

    @NotEmpty
    String name;

    @NotEmpty
    String mail;

    String location;

    String size;

    String owner;

    @JsonProperty
    boolean isAfforestation;

    String purpose;

    @JsonProperty
    boolean isSelling;

    @JsonProperty
    boolean isLeasing;

    String lease;

    String comment;

}
