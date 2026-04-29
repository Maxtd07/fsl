
package com.soccerdreamfermana.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.soccerdreamfermana.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
 @Query("""
  select u
  from User u
  where lower(u.email) = lower(:email)
 """)
 Optional<User> findByEmail(@Param("email") String email);

 boolean existsByEmail(String email);
}

