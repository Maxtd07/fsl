package com.soccerdreamfermana.repository;

import com.soccerdreamfermana.model.Member;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

 List<Member> findAllByOrderByNameAsc();

 boolean existsByShirtNumber(Integer shirtNumber);

 boolean existsByShirtNumberAndIdNot(Integer shirtNumber, Long id);
}

