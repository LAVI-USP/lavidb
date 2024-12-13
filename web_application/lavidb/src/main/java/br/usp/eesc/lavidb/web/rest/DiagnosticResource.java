package br.usp.eesc.lavidb.web.rest;

import br.usp.eesc.lavidb.domain.Diagnostic;
import br.usp.eesc.lavidb.repository.DiagnosticRepository;
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
 * REST controller for managing {@link br.usp.eesc.lavidb.domain.Diagnostic}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DiagnosticResource {

    private final Logger log = LoggerFactory.getLogger(DiagnosticResource.class);

    private static final String ENTITY_NAME = "diagnostic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiagnosticRepository diagnosticRepository;

    public DiagnosticResource(DiagnosticRepository diagnosticRepository) {
        this.diagnosticRepository = diagnosticRepository;
    }

    /**
     * {@code POST  /diagnostics} : Create a new diagnostic.
     *
     * @param diagnostic the diagnostic to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new diagnostic, or with status {@code 400 (Bad Request)} if the diagnostic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/diagnostics")
    public ResponseEntity<Diagnostic> createDiagnostic(@Valid @RequestBody Diagnostic diagnostic) throws URISyntaxException {
        log.debug("REST request to save Diagnostic : {}", diagnostic);
        if (diagnostic.getId() != null) {
            throw new BadRequestAlertException("A new diagnostic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Diagnostic result = diagnosticRepository.save(diagnostic);
        return ResponseEntity
            .created(new URI("/api/diagnostics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /diagnostics/:id} : Updates an existing diagnostic.
     *
     * @param id the id of the diagnostic to save.
     * @param diagnostic the diagnostic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diagnostic,
     * or with status {@code 400 (Bad Request)} if the diagnostic is not valid,
     * or with status {@code 500 (Internal Server Error)} if the diagnostic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/diagnostics/{id}")
    public ResponseEntity<Diagnostic> updateDiagnostic(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Diagnostic diagnostic
    ) throws URISyntaxException {
        log.debug("REST request to update Diagnostic : {}, {}", id, diagnostic);
        if (diagnostic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diagnostic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diagnosticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Diagnostic result = diagnosticRepository.save(diagnostic);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diagnostic.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /diagnostics/:id} : Partial updates given fields of an existing diagnostic, field will ignore if it is null
     *
     * @param id the id of the diagnostic to save.
     * @param diagnostic the diagnostic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diagnostic,
     * or with status {@code 400 (Bad Request)} if the diagnostic is not valid,
     * or with status {@code 404 (Not Found)} if the diagnostic is not found,
     * or with status {@code 500 (Internal Server Error)} if the diagnostic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/diagnostics/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Diagnostic> partialUpdateDiagnostic(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Diagnostic diagnostic
    ) throws URISyntaxException {
        log.debug("REST request to partial update Diagnostic partially : {}, {}", id, diagnostic);
        if (diagnostic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diagnostic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diagnosticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Diagnostic> result = diagnosticRepository
            .findById(diagnostic.getId())
            .map(existingDiagnostic -> {
                if (diagnostic.getBirads() != null) {
                    existingDiagnostic.setBirads(diagnostic.getBirads());
                }
                if (diagnostic.getDescription() != null) {
                    existingDiagnostic.setDescription(diagnostic.getDescription());
                }

                return existingDiagnostic;
            })
            .map(diagnosticRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diagnostic.getId().toString())
        );
    }

    /**
     * {@code GET  /diagnostics} : get all the diagnostics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of diagnostics in body.
     */
    @GetMapping("/diagnostics")
    public List<Diagnostic> getAllDiagnostics() {
        log.debug("REST request to get all Diagnostics");
        return diagnosticRepository.findAll();
    }

    /**
     * {@code GET  /diagnostics/:id} : get the "id" diagnostic.
     *
     * @param id the id of the diagnostic to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the diagnostic, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/diagnostics/{id}")
    public ResponseEntity<Diagnostic> getDiagnostic(@PathVariable Long id) {
        log.debug("REST request to get Diagnostic : {}", id);
        Optional<Diagnostic> diagnostic = diagnosticRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(diagnostic);
    }

    /**
     * {@code DELETE  /diagnostics/:id} : delete the "id" diagnostic.
     *
     * @param id the id of the diagnostic to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/diagnostics/{id}")
    public ResponseEntity<Void> deleteDiagnostic(@PathVariable Long id) {
        log.debug("REST request to delete Diagnostic : {}", id);
        diagnosticRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
