package org.dicadeveloper.weplantaforest.admin.codes;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.dicadeveloper.weplantaforest.trees.User;
import org.springframework.hateoas.Identifiable;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Entity
@Getter
@ToString
@EqualsAndHashCode
public class Team implements Identifiable<Long> {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "_teamId")
	private Long id;

	private Long _timeStamp;

	@Column(nullable = false, unique = true, length = 256)
	private String _name;

	@OneToMany(mappedBy = "_team", fetch = FetchType.EAGER)
	private List<User> _members = new ArrayList<User>();

	@Column(/* length = ModifiedMySql5InnoDbDialect.LENGTH_FOR_TEXT_TYPE */)
	private String _description;

	@OneToOne(optional = false)
	private User _admin;

	public void addMember(final User member) {
		if (!_members.contains(member)) {
			_members.add(member);
		}
	}

	public void removeMember(final User user) {
		if (!_admin.equals(user)) {
			_members.remove(user);
		}
	}

	public Date getDate() {
		return new Date(_timeStamp);
	}

	public boolean isMember(final User user) {
		return _members.contains(user);
	}

	public boolean isLeader(final User user) {
		return _admin.equals(user);
	}
}
