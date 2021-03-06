package org.dicadeveloper.weplantaforest.admin.event;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.dicadeveloper.weplantaforest.admin.team.Team;
import org.dicadeveloper.weplantaforest.admin.user.User;
import org.dicadeveloper.weplantaforest.admin.views.Views;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "_id")
    @JsonView(Views.EventOverview.class)
    private Long id;

    @Column(name = "_name", nullable = false, unique = true)
    @JsonView(Views.EventOverview.class)
    private String name;

    @ManyToOne
    @JoinColumn(name = "_team__teamId")
    @JsonView(Views.EventDetails.class)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "_user__userId")
    @JsonView(Views.EventDetails.class)
    private User user;

}
