package org.dicadeveloper.weplantaforest.articlemanager.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.dicadeveloper.weplantaforest.articlemanager.views.Views;
import org.springframework.hateoas.Identifiable;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Table(name = "User")
public class User implements Identifiable<Long> {

    @Id
    @GeneratedValue
    @Column(name = "_userId")
    private Long id;

    @Column(unique = true, name = "_name")
    @JsonView({ Views.UserArticleView.class})
    private String name;

    @Column(name = "_enabled", nullable = false)
    private boolean enabled = false;

    @Column(name = "_banned", nullable = false)
    private boolean banned = false;

    @Column(name = "_regDate")
    private Long regDate;

    @Column(name = "_organisationType")
    private int organizationType;
}
