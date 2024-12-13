package br.usp.eesc.lavidb.repository;

import br.usp.eesc.lavidb.domain.DatabaseVersion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DatabaseVersion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DatabaseVersionRepository extends JpaRepository<DatabaseVersion, Long> {
    @Query("SELECT max(dv.versionNumber) FROM DatabaseVersion dv ")
    Integer maxVersion();
}
