package org.dicadeveloper.weplantaforest.user;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends CrudRepository<User, Long> {

    public final static String USER_EXISTS_QUERY = "SELECT COUNT(user) FROM User user WHERE user.name = :name)";

    public final static String GET_USER_DETAILS_QUERY = "SELECT new org.dicadeveloper.weplantaforest.user.UserReportData(user.name, COALESCE(user.imageName, 'anonymous.jpg'), user.regDate, user.lastVisit, user.organizationType, COALESCE(tm.name, ''))"
            + " FROM User user LEFT JOIN user.team tm WHERE user.name = :name";

    @Query
    public User findByName(@Param("name") String name);

    @Query(value = USER_EXISTS_QUERY)
    public long userExists(@Param("name") String name);

    @Query(value = GET_USER_DETAILS_QUERY)
    public UserReportData getUserDetails(@Param("name") String name);

}
