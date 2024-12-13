package br.usp.eesc.lavidb.web.rest;

import br.usp.eesc.lavidb.domain.Acquisition;
import br.usp.eesc.lavidb.domain.Institution;
import br.usp.eesc.lavidb.domain.Manufacturer;
import br.usp.eesc.lavidb.domain.Patient;
import br.usp.eesc.lavidb.repository.AcquisitionRepository;
import br.usp.eesc.lavidb.repository.InstitutionRepository;
import br.usp.eesc.lavidb.repository.ManufacturerRepository;
import br.usp.eesc.lavidb.repository.PatientRepository;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.usp.eesc.lavidb.domain.Acquisition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AcquisitionResource {

    private final Logger log = LoggerFactory.getLogger(AcquisitionResource.class);

    private static final String ENTITY_NAME = "acquisition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AcquisitionRepository acquisitionRepository;
    private final PatientRepository patientRepository;
    private final InstitutionRepository institutionRepository;
    private final ManufacturerRepository manufacturerRepository;

    public AcquisitionResource(
        AcquisitionRepository acquisitionRepository,
        PatientRepository patientRepository,
        InstitutionRepository institutionRepository,
        ManufacturerRepository manufacturerRepository
    ) {
        this.acquisitionRepository = acquisitionRepository;
        this.manufacturerRepository = manufacturerRepository;
        this.institutionRepository = institutionRepository;
        this.patientRepository = patientRepository;
    }

    /**
     * {@code POST  /acquisitions} : Create a new acquisition.
     *
     * @param acquisition the acquisition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new acquisition, or with status {@code 400 (Bad Request)} if the acquisition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/acquisitions")
    public ResponseEntity<Acquisition> createAcquisition(@Valid @RequestBody Acquisition acquisition) throws URISyntaxException {
        log.debug("REST request to save Acquisition : {}", acquisition);
        if (acquisition.getId() != null) {
            throw new BadRequestAlertException("A new acquisition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Patient patient = patientRepository.findByHash(acquisition.getPatient().getHash());
        if (patient == null) {
            patient = patientRepository.save(acquisition.getPatient());
        }
        Institution institution = institutionRepository.findByHash(acquisition.getInstitution().getHash());
        if (institution == null) {
            institution = institutionRepository.save(acquisition.getInstitution());
        }

        Manufacturer manufacturer = manufacturerRepository.findByHash(acquisition.getManufacturer().getHash());
        if (manufacturer == null) {
            manufacturer = manufacturerRepository.save(acquisition.getManufacturer());
        }

        acquisition.setPatient(patient);
        acquisition.setInstitution(institution);
        acquisition.setManufacturer(manufacturer);
        Acquisition result = acquisitionRepository.save(acquisition);
        return ResponseEntity
            .created(new URI("/api/acquisitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /acquisitions/:id} : Updates an existing acquisition.
     *
     * @param id the id of the acquisition to save.
     * @param acquisition the acquisition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated acquisition,
     * or with status {@code 400 (Bad Request)} if the acquisition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the acquisition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/acquisitions/{id}")
    public ResponseEntity<Acquisition> updateAcquisition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Acquisition acquisition
    ) throws URISyntaxException {
        log.debug("REST request to update Acquisition : {}, {}", id, acquisition);
        if (acquisition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, acquisition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!acquisitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Acquisition result = acquisitionRepository.save(acquisition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, acquisition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /acquisitions/:id} : Partial updates given fields of an existing acquisition, field will ignore if it is null
     *
     * @param id the id of the acquisition to save.
     * @param acquisition the acquisition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated acquisition,
     * or with status {@code 400 (Bad Request)} if the acquisition is not valid,
     * or with status {@code 404 (Not Found)} if the acquisition is not found,
     * or with status {@code 500 (Internal Server Error)} if the acquisition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/acquisitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Acquisition> partialUpdateAcquisition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Acquisition acquisition
    ) throws URISyntaxException {
        log.debug("REST request to partial update Acquisition partially : {}, {}", id, acquisition);
        if (acquisition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, acquisition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!acquisitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Acquisition> result = acquisitionRepository
            .findById(acquisition.getId())
            .map(existingAcquisition -> {
                if (acquisition.getAccessionNumber() != null) {
                    existingAcquisition.setAccessionNumber(acquisition.getAccessionNumber());
                }
                if (acquisition.getAcquisitionDate() != null) {
                    existingAcquisition.setAcquisitionDate(acquisition.getAcquisitionDate());
                }
                if (acquisition.getImageLaterality() != null) {
                    existingAcquisition.setImageLaterality(acquisition.getImageLaterality());
                }
                if (acquisition.getViewPosition() != null) {
                    existingAcquisition.setViewPosition(acquisition.getViewPosition());
                }
                if (acquisition.getImagePath() != null) {
                    existingAcquisition.setImagePath(acquisition.getImagePath());
                }
                if (acquisition.getImageRaw() != null) {
                    existingAcquisition.setImageRaw(acquisition.getImageRaw());
                }
                if (acquisition.getThumbPath() != null) {
                    existingAcquisition.setThumbPath(acquisition.getThumbPath());
                }

                return existingAcquisition;
            })
            .map(acquisitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, acquisition.getId().toString())
        );
    }

    /**
     * {@code GET  /acquisitions} : get all the acquisitions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of acquisitions in body.
     */
    @GetMapping("/acquisitions")
    public ResponseEntity<List<Acquisition>> getAllAcquisitions(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Acquisitions");
        Page<Acquisition> page = acquisitionRepository.findAll(pageable);
        //page.getContent().forEach(acquisition -> log.info(acquisition.getPatient().getName()));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /acquisitions/:i} : get the "id" acquisition.
     *
     * @param id the id of the acquisition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the acquisition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/acquisitions/{id}")
    public ResponseEntity<Acquisition> getAcquisition(@PathVariable Long id) {
        log.debug("REST request to get Acquisition : {}", id);
        Optional<Acquisition> acquisition = acquisitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(acquisition);
    }

    /**
     * {@code GET  /acquisitions/count} : get the count acquisition.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the acquisition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/acquisitions/count/{versionNumber}")
    public ResponseEntity<Long> count(@PathVariable Integer versionNumber) {
        log.debug("REST request to count ");
        Long acquisitionCount = acquisitionRepository.countByVersion(versionNumber);
        return ResponseEntity.ok(acquisitionCount);
    }

    /**
     * {@code DELETE  /acquisitions/:id} : delete the "id" acquisition.
     *
     * @param id the id of the acquisition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/acquisitions/{id}")
    public ResponseEntity<Void> deleteAcquisition(@PathVariable Long id) {
        log.debug("REST request to delete Acquisition : {}", id);
        acquisitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
