package br.usp.eesc.lavidb.repository;

import br.usp.eesc.lavidb.domain.IrradiationEvent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the IrradiationEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IrradiationEventRepository extends JpaRepository<IrradiationEvent, Long> {}
