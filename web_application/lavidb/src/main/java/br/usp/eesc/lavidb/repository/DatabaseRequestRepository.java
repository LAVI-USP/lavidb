package br.usp.eesc.lavidb.repository;

import br.usp.eesc.lavidb.domain.CustomUser;
import br.usp.eesc.lavidb.domain.DatabaseRequest;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DatabaseRequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DatabaseRequestRepository extends JpaRepository<DatabaseRequest, Long> {
    List<DatabaseRequest> findAllByCustomUserOrderByIdDesc(CustomUser customUser);
}
