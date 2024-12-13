package br.usp.eesc.lavidb.repository;

import br.usp.eesc.lavidb.domain.CustomUser;
import br.usp.eesc.lavidb.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CustomUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomUserRepository extends JpaRepository<CustomUser, Long> {
    CustomUser findByInternalUser(User user);

    @Query("SELECT a.internalUser FROM CustomUser a WHERE a.id = :id ")
    User getCustomUser(@Param("id") Long id);
}
