package br.usp.eesc.lavidb.repository;

import br.usp.eesc.lavidb.domain.Diagnostic;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Diagnostic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DiagnosticRepository extends JpaRepository<Diagnostic, Long> {}
