package br.usp.eesc.lavidb.web.rest;

import br.usp.eesc.lavidb.domain.CustomUser;
import br.usp.eesc.lavidb.domain.User;
import br.usp.eesc.lavidb.repository.CustomUserRepository;
import br.usp.eesc.lavidb.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
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
 * REST controller for managing {@link br.usp.eesc.lavidb.domain.CustomUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CustomUserResource {

    private final Logger log = LoggerFactory.getLogger(CustomUserResource.class);

    private static final String ENTITY_NAME = "customUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomUserRepository customUserRepository;

    public CustomUserResource(CustomUserRepository customUserRepository) {
        this.customUserRepository = customUserRepository;
    }

    /**
     * {@code POST  /custom-users} : Create a new customUser.
     *
     * @param customUser the customUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customUser, or with status {@code 400 (Bad Request)} if the customUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/custom-users")
    public ResponseEntity<CustomUser> createCustomUser(@Valid @RequestBody CustomUser customUser) throws URISyntaxException {
        log.debug("REST request to save CustomUser : {}", customUser);
        if (customUser.getId() != null) {
            throw new BadRequestAlertException("A new customUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomUser result = customUserRepository.save(customUser);
        return ResponseEntity
            .created(new URI("/api/custom-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /custom-users/:id} : Updates an existing customUser.
     *
     * @param id the id of the customUser to save.
     * @param customUser the customUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customUser,
     * or with status {@code 400 (Bad Request)} if the customUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/custom-users/{id}")
    public ResponseEntity<CustomUser> updateCustomUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CustomUser customUser
    ) throws URISyntaxException {
        log.debug("REST request to update CustomUser : {}, {}", id, customUser);
        if (customUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CustomUser result = customUserRepository.save(customUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, customUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /custom-users/:id} : Partial updates given fields of an existing customUser, field will ignore if it is null
     *
     * @param id the id of the customUser to save.
     * @param customUser the customUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customUser,
     * or with status {@code 400 (Bad Request)} if the customUser is not valid,
     * or with status {@code 404 (Not Found)} if the customUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the customUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/custom-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomUser> partialUpdateCustomUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CustomUser customUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update CustomUser partially : {}, {}", id, customUser);
        if (customUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CustomUser> result = customUserRepository
            .findById(customUser.getId())
            .map(existingCustomUser -> {
                if (customUser.getLicensePath() != null) {
                    existingCustomUser.setLicensePath(customUser.getLicensePath());
                }

                return existingCustomUser;
            })
            .map(customUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, customUser.getId().toString())
        );
    }

    /**
     * {@code GET  /custom-users} : get all the customUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customUsers in body.
     */
    @GetMapping("/custom-users")
    public List<CustomUser> getAllCustomUsers() {
        log.debug("REST request to get all CustomUsers");
        return customUserRepository.findAll();
    }

    /**
     * {@code GET  /custom-users/:id} : get the "id" customUser.
     *
     * @param id the id of the customUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/custom-users/{id}")
    public ResponseEntity<User> getCustomUser(@PathVariable Long id) {
        log.debug("REST request to get CustomUser : {}", id);
        User user = customUserRepository.getCustomUser(id);
        return ResponseEntity.ok().body(user);
    }

    /**
     * {@code DELETE  /custom-users/:id} : delete the "id" customUser.
     *
     * @param id the id of the customUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/custom-users/{id}")
    public ResponseEntity<Void> deleteCustomUser(@PathVariable Long id) {
        log.debug("REST request to delete CustomUser : {}", id);
        customUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
