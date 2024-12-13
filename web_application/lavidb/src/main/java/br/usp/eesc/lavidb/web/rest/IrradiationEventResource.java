package br.usp.eesc.lavidb.web.rest;

import br.usp.eesc.lavidb.domain.IrradiationEvent;
import br.usp.eesc.lavidb.repository.IrradiationEventRepository;
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
 * REST controller for managing {@link br.usp.eesc.lavidb.domain.IrradiationEvent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IrradiationEventResource {

    private final Logger log = LoggerFactory.getLogger(IrradiationEventResource.class);

    private static final String ENTITY_NAME = "irradiationEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IrradiationEventRepository irradiationEventRepository;

    public IrradiationEventResource(IrradiationEventRepository irradiationEventRepository) {
        this.irradiationEventRepository = irradiationEventRepository;
    }

    /**
     * {@code POST  /irradiation-events} : Create a new irradiationEvent.
     *
     * @param irradiationEvent the irradiationEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new irradiationEvent, or with status {@code 400 (Bad Request)} if the irradiationEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/irradiation-events")
    public ResponseEntity<IrradiationEvent> createIrradiationEvent(@Valid @RequestBody IrradiationEvent irradiationEvent)
        throws URISyntaxException {
        log.debug("REST request to save IrradiationEvent : {}", irradiationEvent);
        if (irradiationEvent.getId() != null) {
            throw new BadRequestAlertException("A new irradiationEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IrradiationEvent result = irradiationEventRepository.save(irradiationEvent);
        return ResponseEntity
            .created(new URI("/api/irradiation-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /irradiation-events/:id} : Updates an existing irradiationEvent.
     *
     * @param id the id of the irradiationEvent to save.
     * @param irradiationEvent the irradiationEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated irradiationEvent,
     * or with status {@code 400 (Bad Request)} if the irradiationEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the irradiationEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/irradiation-events/{id}")
    public ResponseEntity<IrradiationEvent> updateIrradiationEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody IrradiationEvent irradiationEvent
    ) throws URISyntaxException {
        log.debug("REST request to update IrradiationEvent : {}, {}", id, irradiationEvent);
        if (irradiationEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, irradiationEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!irradiationEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        IrradiationEvent result = irradiationEventRepository.save(irradiationEvent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, irradiationEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /irradiation-events/:id} : Partial updates given fields of an existing irradiationEvent, field will ignore if it is null
     *
     * @param id the id of the irradiationEvent to save.
     * @param irradiationEvent the irradiationEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated irradiationEvent,
     * or with status {@code 400 (Bad Request)} if the irradiationEvent is not valid,
     * or with status {@code 404 (Not Found)} if the irradiationEvent is not found,
     * or with status {@code 500 (Internal Server Error)} if the irradiationEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/irradiation-events/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<IrradiationEvent> partialUpdateIrradiationEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody IrradiationEvent irradiationEvent
    ) throws URISyntaxException {
        log.debug("REST request to partial update IrradiationEvent partially : {}, {}", id, irradiationEvent);
        if (irradiationEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, irradiationEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!irradiationEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<IrradiationEvent> result = irradiationEventRepository
            .findById(irradiationEvent.getId())
            .map(existingIrradiationEvent -> {
                if (irradiationEvent.getRelativeXrayExposure() != null) {
                    existingIrradiationEvent.setRelativeXrayExposure(irradiationEvent.getRelativeXrayExposure());
                }
                if (irradiationEvent.getKvp() != null) {
                    existingIrradiationEvent.setKvp(irradiationEvent.getKvp());
                }
                if (irradiationEvent.getDosemAs() != null) {
                    existingIrradiationEvent.setDosemAs(irradiationEvent.getDosemAs());
                }
                if (irradiationEvent.getDosemGy() != null) {
                    existingIrradiationEvent.setDosemGy(irradiationEvent.getDosemGy());
                }

                return existingIrradiationEvent;
            })
            .map(irradiationEventRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, irradiationEvent.getId().toString())
        );
    }

    /**
     * {@code GET  /irradiation-events} : get all the irradiationEvents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of irradiationEvents in body.
     */
    @GetMapping("/irradiation-events")
    public List<IrradiationEvent> getAllIrradiationEvents() {
        log.debug("REST request to get all IrradiationEvents");
        return irradiationEventRepository.findAll();
    }

    /**
     * {@code GET  /irradiation-events/:id} : get the "id" irradiationEvent.
     *
     * @param id the id of the irradiationEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the irradiationEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/irradiation-events/{id}")
    public ResponseEntity<IrradiationEvent> getIrradiationEvent(@PathVariable Long id) {
        log.debug("REST request to get IrradiationEvent : {}", id);
        Optional<IrradiationEvent> irradiationEvent = irradiationEventRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(irradiationEvent);
    }

    /**
     * {@code DELETE  /irradiation-events/:id} : delete the "id" irradiationEvent.
     *
     * @param id the id of the irradiationEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/irradiation-events/{id}")
    public ResponseEntity<Void> deleteIrradiationEvent(@PathVariable Long id) {
        log.debug("REST request to delete IrradiationEvent : {}", id);
        irradiationEventRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
