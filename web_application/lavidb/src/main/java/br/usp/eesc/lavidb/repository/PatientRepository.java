package br.usp.eesc.lavidb.repository;

import br.usp.eesc.lavidb.domain.DatabaseVersion;
import br.usp.eesc.lavidb.domain.Patient;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Patient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByHash(String hash);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.databaseVersion.versionNumber <= :versionNumber ")
    long countByVersion(@Param("versionNumber") Integer versionNumber);

    @Modifying
    @Query("UPDATE Patient p set p.databaseVersion = :databaseVersion WHERE p.databaseVersion is null")
    void tagVersion(@Param("databaseVersion") DatabaseVersion databaseVersion);
}
