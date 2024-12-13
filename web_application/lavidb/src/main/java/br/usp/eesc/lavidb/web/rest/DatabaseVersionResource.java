package br.usp.eesc.lavidb.web.rest;

import br.usp.eesc.lavidb.domain.DatabaseVersion;
import br.usp.eesc.lavidb.repository.AcquisitionRepository;
import br.usp.eesc.lavidb.repository.DatabaseVersionRepository;
import br.usp.eesc.lavidb.repository.PatientRepository;
import br.usp.eesc.lavidb.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.usp.eesc.lavidb.domain.DatabaseVersion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DatabaseVersionResource {

    private final Logger log = LoggerFactory.getLogger(DatabaseVersionResource.class);

    private static final String ENTITY_NAME = "databaseVersion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DatabaseVersionRepository databaseVersionRepository;

    private final AcquisitionRepository acquisitionRepository;

    private final PatientRepository patientRepository;

    public DatabaseVersionResource(
        DatabaseVersionRepository databaseVersionRepository,
        AcquisitionRepository acquisitionRepository,
        PatientRepository patientRepository
    ) {
        this.databaseVersionRepository = databaseVersionRepository;
        this.acquisitionRepository = acquisitionRepository;
        this.patientRepository = patientRepository;
    }

    /**
     * {@code POST  /database-versions} : Create a new databaseVersion.
     *
     * @param databaseVersion the databaseVersion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new databaseVersion, or with status {@code 400 (Bad Request)} if the databaseVersion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/database-versions")
    public ResponseEntity<DatabaseVersion> createDatabaseVersion(@Valid @RequestBody DatabaseVersion databaseVersion)
        throws URISyntaxException {
        log.debug("REST request to save DatabaseVersion : {}", databaseVersion);
        if (databaseVersion.getId() != null) {
            throw new BadRequestAlertException("A new databaseVersion cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Integer maxVersion = databaseVersionRepository.maxVersion();
        log.debug("MAX DatabaseVersion : {}", maxVersion);
        databaseVersion.setVersionNumber(maxVersion + 1);
        databaseVersion.createdDate(Instant.now());
        DatabaseVersion result = databaseVersionRepository.saveAndFlush(databaseVersion);
        log.debug("TAGGING IMAGES WITH THE NEW VERSION...{}", result);
        acquisitionRepository.tagVersion(result);
        log.debug("TAGGING PATIENTS WITH THE NEW VERSION...{}", result);
        patientRepository.tagVersion(result);

        return ResponseEntity
            .created(new URI("/api/database-versions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /database-versions/:id} : Updates an existing databaseVersion.
     *
     * @param id the id of the databaseVersion to save.
     * @param databaseVersion the databaseVersion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated databaseVersion,
     * or with status {@code 400 (Bad Request)} if the databaseVersion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the databaseVersion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/database-versions/{id}")
    public ResponseEntity<DatabaseVersion> updateDatabaseVersion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DatabaseVersion databaseVersion
    ) throws URISyntaxException {
        log.debug("REST request to update DatabaseVersion : {}, {}", id, databaseVersion);
        if (databaseVersion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, databaseVersion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!databaseVersionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DatabaseVersion result = databaseVersionRepository.save(databaseVersion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, databaseVersion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /database-versions/:id} : Partial updates given fields of an existing databaseVersion, field will ignore if it is null
     *
     * @param id the id of the databaseVersion to save.
     * @param databaseVersion the databaseVersion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated databaseVersion,
     * or with status {@code 400 (Bad Request)} if the databaseVersion is not valid,
     * or with status {@code 404 (Not Found)} if the databaseVersion is not found,
     * or with status {@code 500 (Internal Server Error)} if the databaseVersion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/database-versions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DatabaseVersion> partialUpdateDatabaseVersion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DatabaseVersion databaseVersion
    ) throws URISyntaxException {
        log.debug("REST request to partial update DatabaseVersion partially : {}, {}", id, databaseVersion);
        if (databaseVersion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, databaseVersion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!databaseVersionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DatabaseVersion> result = databaseVersionRepository
            .findById(databaseVersion.getId())
            .map(existingDatabaseVersion -> {
                if (databaseVersion.getVersionNumber() != null) {
                    existingDatabaseVersion.setVersionNumber(databaseVersion.getVersionNumber());
                }
                if (databaseVersion.getCreatedDate() != null) {
                    existingDatabaseVersion.setCreatedDate(databaseVersion.getCreatedDate());
                }

                return existingDatabaseVersion;
            })
            .map(databaseVersionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, databaseVersion.getId().toString())
        );
    }

    /**
     * {@code GET  /database-versions} : get all the databaseVersions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of databaseVersions in body.
     */
    @GetMapping("/database-versions")
    public List<DatabaseVersion> getAllDatabaseVersions() {
        log.debug("REST request to get all DatabaseVersions");
        return databaseVersionRepository.findAll();
    }

    /**
     * {@code GET  /database-versions/:id} : get the "id" databaseVersion.
     *
     * @param id the id of the databaseVersion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the databaseVersion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/database-versions/{id}")
    public ResponseEntity<DatabaseVersion> getDatabaseVersion(@PathVariable Long id) {
        log.debug("REST request to get DatabaseVersion : {}", id);
        Optional<DatabaseVersion> databaseVersion = databaseVersionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(databaseVersion);
    }

    /**
     * {@code DELETE  /database-versions/:id} : delete the "id" databaseVersion.
     *
     * @param id the id of the databaseVersion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/database-versions/{id}")
    public ResponseEntity<Void> deleteDatabaseVersion(@PathVariable Long id) {
        log.debug("REST request to delete DatabaseVersion : {}", id);
        databaseVersionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
