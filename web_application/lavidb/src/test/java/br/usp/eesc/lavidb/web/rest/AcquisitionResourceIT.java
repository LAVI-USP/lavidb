package br.usp.eesc.lavidb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.usp.eesc.lavidb.IntegrationTest;
import br.usp.eesc.lavidb.domain.Acquisition;
import br.usp.eesc.lavidb.repository.AcquisitionRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AcquisitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AcquisitionResourceIT {

    private static final String DEFAULT_ACCESSION_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_ACCESSION_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_ACQUISITION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ACQUISITION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_IMAGE_LATERALITY = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_LATERALITY = "BBBBBBBBBB";

    private static final String DEFAULT_VIEW_POSITION = "AAAAAAAAAA";
    private static final String UPDATED_VIEW_POSITION = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_PATH = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_PATH = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_RAW = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_RAW = "BBBBBBBBBB";

    private static final String DEFAULT_THUMB_PATH = "AAAAAAAAAA";
    private static final String UPDATED_THUMB_PATH = "BBBBBBBBBB";

    private static final Integer DEFAULT_VERSION = 1;
    private static final Integer UPDATED_VERSION = 2;

    private static final String ENTITY_API_URL = "/api/acquisitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AcquisitionRepository acquisitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAcquisitionMockMvc;

    private Acquisition acquisition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Acquisition createEntity(EntityManager em) {
        Acquisition acquisition = new Acquisition()
            .accessionNumber(DEFAULT_ACCESSION_NUMBER)
            .acquisitionDate(DEFAULT_ACQUISITION_DATE)
            .imageLaterality(DEFAULT_IMAGE_LATERALITY)
            .viewPosition(DEFAULT_VIEW_POSITION)
            .imagePath(DEFAULT_IMAGE_PATH)
            .imageRaw(DEFAULT_IMAGE_RAW)
            .thumbPath(DEFAULT_THUMB_PATH);
        return acquisition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Acquisition createUpdatedEntity(EntityManager em) {
        Acquisition acquisition = new Acquisition()
            .accessionNumber(UPDATED_ACCESSION_NUMBER)
            .acquisitionDate(UPDATED_ACQUISITION_DATE)
            .imageLaterality(UPDATED_IMAGE_LATERALITY)
            .viewPosition(UPDATED_VIEW_POSITION)
            .imagePath(UPDATED_IMAGE_PATH)
            .imageRaw(UPDATED_IMAGE_RAW)
            .thumbPath(UPDATED_THUMB_PATH);
        return acquisition;
    }

    @BeforeEach
    public void initTest() {
        acquisition = createEntity(em);
    }

    @Test
    @Transactional
    void createAcquisition() throws Exception {
        int databaseSizeBeforeCreate = acquisitionRepository.findAll().size();
        // Create the Acquisition
        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isCreated());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeCreate + 1);
        Acquisition testAcquisition = acquisitionList.get(acquisitionList.size() - 1);
        assertThat(testAcquisition.getAccessionNumber()).isEqualTo(DEFAULT_ACCESSION_NUMBER);
        assertThat(testAcquisition.getAcquisitionDate()).isEqualTo(DEFAULT_ACQUISITION_DATE);
        assertThat(testAcquisition.getImageLaterality()).isEqualTo(DEFAULT_IMAGE_LATERALITY);
        assertThat(testAcquisition.getViewPosition()).isEqualTo(DEFAULT_VIEW_POSITION);
        assertThat(testAcquisition.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
        assertThat(testAcquisition.getImageRaw()).isEqualTo(DEFAULT_IMAGE_RAW);
        assertThat(testAcquisition.getThumbPath()).isEqualTo(DEFAULT_THUMB_PATH);
    }

    @Test
    @Transactional
    void createAcquisitionWithExistingId() throws Exception {
        // Create the Acquisition with an existing ID
        acquisition.setId(1L);

        int databaseSizeBeforeCreate = acquisitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAccessionNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();
        // set the field null
        acquisition.setAccessionNumber(null);

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAcquisitionDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();
        // set the field null
        acquisition.setAcquisitionDate(null);

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkImageLateralityIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();
        // set the field null
        acquisition.setImageLaterality(null);

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkViewPositionIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();
        // set the field null
        acquisition.setViewPosition(null);

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkImagePathIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();
        // set the field null
        acquisition.setImagePath(null);

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkImageRawIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();
        // set the field null
        acquisition.setImageRaw(null);

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkThumbPathIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();
        // set the field null
        acquisition.setThumbPath(null);

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVersionIsRequired() throws Exception {
        int databaseSizeBeforeTest = acquisitionRepository.findAll().size();

        // Create the Acquisition, which fails.

        restAcquisitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isBadRequest());

        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAcquisitions() throws Exception {
        // Initialize the database
        acquisitionRepository.saveAndFlush(acquisition);

        // Get all the acquisitionList
        restAcquisitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(acquisition.getId().intValue())))
            .andExpect(jsonPath("$.[*].accessionNumber").value(hasItem(DEFAULT_ACCESSION_NUMBER)))
            .andExpect(jsonPath("$.[*].acquisitionDate").value(hasItem(DEFAULT_ACQUISITION_DATE.toString())))
            .andExpect(jsonPath("$.[*].imageLaterality").value(hasItem(DEFAULT_IMAGE_LATERALITY)))
            .andExpect(jsonPath("$.[*].viewPosition").value(hasItem(DEFAULT_VIEW_POSITION)))
            .andExpect(jsonPath("$.[*].imagePath").value(hasItem(DEFAULT_IMAGE_PATH)))
            .andExpect(jsonPath("$.[*].imageRaw").value(hasItem(DEFAULT_IMAGE_RAW)))
            .andExpect(jsonPath("$.[*].thumbPath").value(hasItem(DEFAULT_THUMB_PATH)))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)));
    }

    @Test
    @Transactional
    void getAcquisition() throws Exception {
        // Initialize the database
        acquisitionRepository.saveAndFlush(acquisition);

        // Get the acquisition
        restAcquisitionMockMvc
            .perform(get(ENTITY_API_URL_ID, acquisition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(acquisition.getId().intValue()))
            .andExpect(jsonPath("$.accessionNumber").value(DEFAULT_ACCESSION_NUMBER))
            .andExpect(jsonPath("$.acquisitionDate").value(DEFAULT_ACQUISITION_DATE.toString()))
            .andExpect(jsonPath("$.imageLaterality").value(DEFAULT_IMAGE_LATERALITY))
            .andExpect(jsonPath("$.viewPosition").value(DEFAULT_VIEW_POSITION))
            .andExpect(jsonPath("$.imagePath").value(DEFAULT_IMAGE_PATH))
            .andExpect(jsonPath("$.imageRaw").value(DEFAULT_IMAGE_RAW))
            .andExpect(jsonPath("$.thumbPath").value(DEFAULT_THUMB_PATH))
            .andExpect(jsonPath("$.version").value(DEFAULT_VERSION));
    }

    @Test
    @Transactional
    void getNonExistingAcquisition() throws Exception {
        // Get the acquisition
        restAcquisitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAcquisition() throws Exception {
        // Initialize the database
        acquisitionRepository.saveAndFlush(acquisition);

        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();

        // Update the acquisition
        Acquisition updatedAcquisition = acquisitionRepository.findById(acquisition.getId()).get();
        // Disconnect from session so that the updates on updatedAcquisition are not directly saved in db
        em.detach(updatedAcquisition);
        updatedAcquisition
            .accessionNumber(UPDATED_ACCESSION_NUMBER)
            .acquisitionDate(UPDATED_ACQUISITION_DATE)
            .imageLaterality(UPDATED_IMAGE_LATERALITY)
            .viewPosition(UPDATED_VIEW_POSITION)
            .imagePath(UPDATED_IMAGE_PATH)
            .imageRaw(UPDATED_IMAGE_RAW)
            .thumbPath(UPDATED_THUMB_PATH);

        restAcquisitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAcquisition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAcquisition))
            )
            .andExpect(status().isOk());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
        Acquisition testAcquisition = acquisitionList.get(acquisitionList.size() - 1);
        assertThat(testAcquisition.getAccessionNumber()).isEqualTo(UPDATED_ACCESSION_NUMBER);
        assertThat(testAcquisition.getAcquisitionDate()).isEqualTo(UPDATED_ACQUISITION_DATE);
        assertThat(testAcquisition.getImageLaterality()).isEqualTo(UPDATED_IMAGE_LATERALITY);
        assertThat(testAcquisition.getViewPosition()).isEqualTo(UPDATED_VIEW_POSITION);
        assertThat(testAcquisition.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
        assertThat(testAcquisition.getImageRaw()).isEqualTo(UPDATED_IMAGE_RAW);
        assertThat(testAcquisition.getThumbPath()).isEqualTo(UPDATED_THUMB_PATH);
    }

    @Test
    @Transactional
    void putNonExistingAcquisition() throws Exception {
        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();
        acquisition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcquisitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, acquisition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(acquisition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAcquisition() throws Exception {
        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();
        acquisition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcquisitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(acquisition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAcquisition() throws Exception {
        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();
        acquisition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcquisitionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acquisition)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAcquisitionWithPatch() throws Exception {
        // Initialize the database
        acquisitionRepository.saveAndFlush(acquisition);

        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();

        // Update the acquisition using partial update
        Acquisition partialUpdatedAcquisition = new Acquisition();
        partialUpdatedAcquisition.setId(acquisition.getId());

        partialUpdatedAcquisition
            .accessionNumber(UPDATED_ACCESSION_NUMBER)
            .imageLaterality(UPDATED_IMAGE_LATERALITY)
            .viewPosition(UPDATED_VIEW_POSITION)
            .imagePath(UPDATED_IMAGE_PATH)
            .imageRaw(UPDATED_IMAGE_RAW)
            .thumbPath(UPDATED_THUMB_PATH);

        restAcquisitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcquisition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAcquisition))
            )
            .andExpect(status().isOk());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
        Acquisition testAcquisition = acquisitionList.get(acquisitionList.size() - 1);
        assertThat(testAcquisition.getAccessionNumber()).isEqualTo(UPDATED_ACCESSION_NUMBER);
        assertThat(testAcquisition.getAcquisitionDate()).isEqualTo(DEFAULT_ACQUISITION_DATE);
        assertThat(testAcquisition.getImageLaterality()).isEqualTo(UPDATED_IMAGE_LATERALITY);
        assertThat(testAcquisition.getViewPosition()).isEqualTo(UPDATED_VIEW_POSITION);
        assertThat(testAcquisition.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
        assertThat(testAcquisition.getImageRaw()).isEqualTo(UPDATED_IMAGE_RAW);
        assertThat(testAcquisition.getThumbPath()).isEqualTo(UPDATED_THUMB_PATH);
    }

    @Test
    @Transactional
    void fullUpdateAcquisitionWithPatch() throws Exception {
        // Initialize the database
        acquisitionRepository.saveAndFlush(acquisition);

        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();

        // Update the acquisition using partial update
        Acquisition partialUpdatedAcquisition = new Acquisition();
        partialUpdatedAcquisition.setId(acquisition.getId());

        partialUpdatedAcquisition
            .accessionNumber(UPDATED_ACCESSION_NUMBER)
            .acquisitionDate(UPDATED_ACQUISITION_DATE)
            .imageLaterality(UPDATED_IMAGE_LATERALITY)
            .viewPosition(UPDATED_VIEW_POSITION)
            .imagePath(UPDATED_IMAGE_PATH)
            .imageRaw(UPDATED_IMAGE_RAW)
            .thumbPath(UPDATED_THUMB_PATH);

        restAcquisitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcquisition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAcquisition))
            )
            .andExpect(status().isOk());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
        Acquisition testAcquisition = acquisitionList.get(acquisitionList.size() - 1);
        assertThat(testAcquisition.getAccessionNumber()).isEqualTo(UPDATED_ACCESSION_NUMBER);
        assertThat(testAcquisition.getAcquisitionDate()).isEqualTo(UPDATED_ACQUISITION_DATE);
        assertThat(testAcquisition.getImageLaterality()).isEqualTo(UPDATED_IMAGE_LATERALITY);
        assertThat(testAcquisition.getViewPosition()).isEqualTo(UPDATED_VIEW_POSITION);
        assertThat(testAcquisition.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
        assertThat(testAcquisition.getImageRaw()).isEqualTo(UPDATED_IMAGE_RAW);
        assertThat(testAcquisition.getThumbPath()).isEqualTo(UPDATED_THUMB_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingAcquisition() throws Exception {
        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();
        acquisition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcquisitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, acquisition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(acquisition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAcquisition() throws Exception {
        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();
        acquisition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcquisitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(acquisition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAcquisition() throws Exception {
        int databaseSizeBeforeUpdate = acquisitionRepository.findAll().size();
        acquisition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcquisitionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(acquisition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Acquisition in the database
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAcquisition() throws Exception {
        // Initialize the database
        acquisitionRepository.saveAndFlush(acquisition);

        int databaseSizeBeforeDelete = acquisitionRepository.findAll().size();

        // Delete the acquisition
        restAcquisitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, acquisition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Acquisition> acquisitionList = acquisitionRepository.findAll();
        assertThat(acquisitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
