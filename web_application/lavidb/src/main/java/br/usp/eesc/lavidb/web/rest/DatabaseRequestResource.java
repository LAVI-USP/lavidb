package br.usp.eesc.lavidb.web.rest;

import br.usp.eesc.lavidb.domain.CustomUser;
import br.usp.eesc.lavidb.domain.DatabaseRequest;
import br.usp.eesc.lavidb.domain.User;
import br.usp.eesc.lavidb.rabbit.QueueSender;
import br.usp.eesc.lavidb.repository.CustomUserRepository;
import br.usp.eesc.lavidb.repository.DatabaseRequestRepository;
import br.usp.eesc.lavidb.repository.UserRepository;
import br.usp.eesc.lavidb.security.SecurityUtils;
import br.usp.eesc.lavidb.service.UserService;
import br.usp.eesc.lavidb.web.rest.errors.BadRequestAlertException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAmount;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.usp.eesc.lavidb.domain.DatabaseRequest}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DatabaseRequestResource {

    @Autowired
    private QueueSender queueSender;

    private final Logger log = LoggerFactory.getLogger(DatabaseRequestResource.class);

    private static final String ENTITY_NAME = "databaseRequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DatabaseRequestRepository databaseRequestRepository;

    private final CustomUserRepository customUserRepository;

    private final UserService userService;

    public DatabaseRequestResource(
        DatabaseRequestRepository databaseRequestRepository,
        CustomUserRepository customUserRepository,
        UserService userService
    ) {
        this.databaseRequestRepository = databaseRequestRepository;
        this.customUserRepository = customUserRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /database-requests} : Create a new databaseRequest.
     *
     * @param databaseRequest the databaseRequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new databaseRequest, or with status {@code 400 (Bad Request)} if the databaseRequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/database-requests")
    public ResponseEntity<DatabaseRequest> createDatabaseRequest(@Valid @RequestBody DatabaseRequest databaseRequest)
        throws URISyntaxException {
        log.debug("REST request to save DatabaseRequest : {}", databaseRequest);
        log.debug("DatabaseVersion : {}", databaseRequest.getDatabaseVersion().getVersionNumber());
        if (databaseRequest.getId() != null) {
            throw new BadRequestAlertException("A new databaseRequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        databaseRequest.setCustomUser(getCustomUser());
        databaseRequest.setCreatedDate(Instant.now());
        databaseRequest.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        DatabaseRequest result = databaseRequestRepository.save(databaseRequest);
        log.info("DatabaseRequest JSON : {}", databaseRequest.toJSON());
        queueSender.send(databaseRequest.toJSON());
        return ResponseEntity
            .created(new URI("/api/database-requests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /database-requests/:id} : Updates an existing databaseRequest.
     *
     * @param id the id of the databaseRequest to save.
     * @param databaseRequest the databaseRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated databaseRequest,
     * or with status {@code 400 (Bad Request)} if the databaseRequest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the databaseRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/database-requests/{id}")
    public ResponseEntity<DatabaseRequest> updateDatabaseRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DatabaseRequest databaseRequest
    ) throws URISyntaxException {
        log.debug("REST request to update DatabaseRequest : {}, {}", id, databaseRequest);
        if (databaseRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, databaseRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!databaseRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DatabaseRequest result = databaseRequestRepository.save(databaseRequest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, databaseRequest.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /database-requests/:id} : Partial updates given fields of an existing databaseRequest, field will ignore if it is null
     *
     * @param id the id of the databaseRequest to save.
     * @param databaseRequest the databaseRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated databaseRequest,
     * or with status {@code 400 (Bad Request)} if the databaseRequest is not valid,
     * or with status {@code 404 (Not Found)} if the databaseRequest is not found,
     * or with status {@code 500 (Internal Server Error)} if the databaseRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/database-requests/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DatabaseRequest> partialUpdateDatabaseRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DatabaseRequest databaseRequest
    ) throws URISyntaxException {
        log.debug("REST request to partial update DatabaseRequest partially : {}, {}", id, databaseRequest);
        if (databaseRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, databaseRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!databaseRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DatabaseRequest> result = databaseRequestRepository
            .findById(databaseRequest.getId())
            .map(existingDatabaseRequest -> {
                if (databaseRequest.getParameters() != null) {
                    existingDatabaseRequest.setParameters(databaseRequest.getParameters());
                }
                if (databaseRequest.getCreatedDate() != null) {
                    existingDatabaseRequest.setCreatedDate(databaseRequest.getCreatedDate());
                }
                if (databaseRequest.getExpiresAt() != null) {
                    existingDatabaseRequest.setExpiresAt(databaseRequest.getExpiresAt());
                }
                if (databaseRequest.getDownloadLink() != null) {
                    existingDatabaseRequest.setDownloadLink(databaseRequest.getDownloadLink());
                }

                return existingDatabaseRequest;
            })
            .map(databaseRequestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, databaseRequest.getId().toString())
        );
    }

    /**
     * {@code GET  /database-requests} : get all the databaseRequests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of databaseRequests in body.
     */
    @GetMapping("/database-requests")
    public List<DatabaseRequest> getAllDatabaseRequests() {
        log.debug("REST request to get all DatabaseRequests");
        //log.debug("User Auth {}", userService.getUserWithAuthorities().get().getAuthorities();

        return databaseRequestRepository.findAllByCustomUserOrderByIdDesc(getCustomUser());
    }

    /**
     * {@code GET  /database-requests/:id} : get the "id" databaseRequest.
     *
     * @param id the id of the databaseRequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the databaseRequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/database-requests/{id}")
    public ResponseEntity<DatabaseRequest> getDatabaseRequest(@PathVariable Long id) {
        log.debug("REST request to get DatabaseRequest : {}", id);
        Optional<DatabaseRequest> databaseRequest = databaseRequestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(databaseRequest);
    }

    /**
     * {@code DELETE  /database-requests/:id} : delete the "id" databaseRequest.
     *
     * @param id the id of the databaseRequest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/database-requests/{id}")
    public ResponseEntity<Void> deleteDatabaseRequest(@PathVariable Long id) {
        log.debug("REST request to delete DatabaseRequest : {}", id);
        databaseRequestRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    private CustomUser getCustomUser() {
        User user = userService.getUserWithAuthorities().get();
        return customUserRepository.findByInternalUser(user);
    }
}
