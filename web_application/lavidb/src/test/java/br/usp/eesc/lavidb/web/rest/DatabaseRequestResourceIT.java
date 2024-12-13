package br.usp.eesc.lavidb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.usp.eesc.lavidb.IntegrationTest;
import br.usp.eesc.lavidb.domain.DatabaseRequest;
import br.usp.eesc.lavidb.repository.DatabaseRequestRepository;
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
 * Integration tests for the {@link DatabaseRequestResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DatabaseRequestResourceIT {

    private static final String DEFAULT_PARAMETERS = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETERS = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_EXPIRES_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPIRES_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DOWNLOAD_LINK = "AAAAAAAAAA";
    private static final String UPDATED_DOWNLOAD_LINK = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/database-requests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DatabaseRequestRepository databaseRequestRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDatabaseRequestMockMvc;

    private DatabaseRequest databaseRequest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DatabaseRequest createEntity(EntityManager em) {
        DatabaseRequest databaseRequest = new DatabaseRequest()
            .parameters(DEFAULT_PARAMETERS)
            .createdDate(DEFAULT_CREATED_DATE)
            .expiresAt(DEFAULT_EXPIRES_AT)
            .downloadLink(DEFAULT_DOWNLOAD_LINK);
        return databaseRequest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DatabaseRequest createUpdatedEntity(EntityManager em) {
        DatabaseRequest databaseRequest = new DatabaseRequest()
            .parameters(UPDATED_PARAMETERS)
            .createdDate(UPDATED_CREATED_DATE)
            .expiresAt(UPDATED_EXPIRES_AT)
            .downloadLink(UPDATED_DOWNLOAD_LINK);
        return databaseRequest;
    }

    @BeforeEach
    public void initTest() {
        databaseRequest = createEntity(em);
    }

    @Test
    @Transactional
    void createDatabaseRequest() throws Exception {
        int databaseSizeBeforeCreate = databaseRequestRepository.findAll().size();
        // Create the DatabaseRequest
        restDatabaseRequestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isCreated());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeCreate + 1);
        DatabaseRequest testDatabaseRequest = databaseRequestList.get(databaseRequestList.size() - 1);
        assertThat(testDatabaseRequest.getParameters()).isEqualTo(DEFAULT_PARAMETERS);
        assertThat(testDatabaseRequest.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testDatabaseRequest.getExpiresAt()).isEqualTo(DEFAULT_EXPIRES_AT);
        assertThat(testDatabaseRequest.getDownloadLink()).isEqualTo(DEFAULT_DOWNLOAD_LINK);
    }

    @Test
    @Transactional
    void createDatabaseRequestWithExistingId() throws Exception {
        // Create the DatabaseRequest with an existing ID
        databaseRequest.setId(1L);

        int databaseSizeBeforeCreate = databaseRequestRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDatabaseRequestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkParametersIsRequired() throws Exception {
        int databaseSizeBeforeTest = databaseRequestRepository.findAll().size();
        // set the field null
        databaseRequest.setParameters(null);

        // Create the DatabaseRequest, which fails.

        restDatabaseRequestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isBadRequest());

        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDatabaseRequests() throws Exception {
        // Initialize the database
        databaseRequestRepository.saveAndFlush(databaseRequest);

        // Get all the databaseRequestList
        restDatabaseRequestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(databaseRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].parameters").value(hasItem(DEFAULT_PARAMETERS)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].expiresAt").value(hasItem(DEFAULT_EXPIRES_AT.toString())))
            .andExpect(jsonPath("$.[*].downloadLink").value(hasItem(DEFAULT_DOWNLOAD_LINK)));
    }

    @Test
    @Transactional
    void getDatabaseRequest() throws Exception {
        // Initialize the database
        databaseRequestRepository.saveAndFlush(databaseRequest);

        // Get the databaseRequest
        restDatabaseRequestMockMvc
            .perform(get(ENTITY_API_URL_ID, databaseRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(databaseRequest.getId().intValue()))
            .andExpect(jsonPath("$.parameters").value(DEFAULT_PARAMETERS))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.expiresAt").value(DEFAULT_EXPIRES_AT.toString()))
            .andExpect(jsonPath("$.downloadLink").value(DEFAULT_DOWNLOAD_LINK));
    }

    @Test
    @Transactional
    void getNonExistingDatabaseRequest() throws Exception {
        // Get the databaseRequest
        restDatabaseRequestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDatabaseRequest() throws Exception {
        // Initialize the database
        databaseRequestRepository.saveAndFlush(databaseRequest);

        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();

        // Update the databaseRequest
        DatabaseRequest updatedDatabaseRequest = databaseRequestRepository.findById(databaseRequest.getId()).get();
        // Disconnect from session so that the updates on updatedDatabaseRequest are not directly saved in db
        em.detach(updatedDatabaseRequest);
        updatedDatabaseRequest
            .parameters(UPDATED_PARAMETERS)
            .createdDate(UPDATED_CREATED_DATE)
            .expiresAt(UPDATED_EXPIRES_AT)
            .downloadLink(UPDATED_DOWNLOAD_LINK);

        restDatabaseRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDatabaseRequest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDatabaseRequest))
            )
            .andExpect(status().isOk());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
        DatabaseRequest testDatabaseRequest = databaseRequestList.get(databaseRequestList.size() - 1);
        assertThat(testDatabaseRequest.getParameters()).isEqualTo(UPDATED_PARAMETERS);
        assertThat(testDatabaseRequest.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testDatabaseRequest.getExpiresAt()).isEqualTo(UPDATED_EXPIRES_AT);
        assertThat(testDatabaseRequest.getDownloadLink()).isEqualTo(UPDATED_DOWNLOAD_LINK);
    }

    @Test
    @Transactional
    void putNonExistingDatabaseRequest() throws Exception {
        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();
        databaseRequest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDatabaseRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, databaseRequest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDatabaseRequest() throws Exception {
        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();
        databaseRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDatabaseRequest() throws Exception {
        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();
        databaseRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseRequestMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDatabaseRequestWithPatch() throws Exception {
        // Initialize the database
        databaseRequestRepository.saveAndFlush(databaseRequest);

        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();

        // Update the databaseRequest using partial update
        DatabaseRequest partialUpdatedDatabaseRequest = new DatabaseRequest();
        partialUpdatedDatabaseRequest.setId(databaseRequest.getId());

        partialUpdatedDatabaseRequest.expiresAt(UPDATED_EXPIRES_AT).downloadLink(UPDATED_DOWNLOAD_LINK);

        restDatabaseRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDatabaseRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDatabaseRequest))
            )
            .andExpect(status().isOk());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
        DatabaseRequest testDatabaseRequest = databaseRequestList.get(databaseRequestList.size() - 1);
        assertThat(testDatabaseRequest.getParameters()).isEqualTo(DEFAULT_PARAMETERS);
        assertThat(testDatabaseRequest.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testDatabaseRequest.getExpiresAt()).isEqualTo(UPDATED_EXPIRES_AT);
        assertThat(testDatabaseRequest.getDownloadLink()).isEqualTo(UPDATED_DOWNLOAD_LINK);
    }

    @Test
    @Transactional
    void fullUpdateDatabaseRequestWithPatch() throws Exception {
        // Initialize the database
        databaseRequestRepository.saveAndFlush(databaseRequest);

        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();

        // Update the databaseRequest using partial update
        DatabaseRequest partialUpdatedDatabaseRequest = new DatabaseRequest();
        partialUpdatedDatabaseRequest.setId(databaseRequest.getId());

        partialUpdatedDatabaseRequest
            .parameters(UPDATED_PARAMETERS)
            .createdDate(UPDATED_CREATED_DATE)
            .expiresAt(UPDATED_EXPIRES_AT)
            .downloadLink(UPDATED_DOWNLOAD_LINK);

        restDatabaseRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDatabaseRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDatabaseRequest))
            )
            .andExpect(status().isOk());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
        DatabaseRequest testDatabaseRequest = databaseRequestList.get(databaseRequestList.size() - 1);
        assertThat(testDatabaseRequest.getParameters()).isEqualTo(UPDATED_PARAMETERS);
        assertThat(testDatabaseRequest.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testDatabaseRequest.getExpiresAt()).isEqualTo(UPDATED_EXPIRES_AT);
        assertThat(testDatabaseRequest.getDownloadLink()).isEqualTo(UPDATED_DOWNLOAD_LINK);
    }

    @Test
    @Transactional
    void patchNonExistingDatabaseRequest() throws Exception {
        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();
        databaseRequest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDatabaseRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, databaseRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDatabaseRequest() throws Exception {
        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();
        databaseRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDatabaseRequest() throws Exception {
        int databaseSizeBeforeUpdate = databaseRequestRepository.findAll().size();
        databaseRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseRequestMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(databaseRequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DatabaseRequest in the database
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDatabaseRequest() throws Exception {
        // Initialize the database
        databaseRequestRepository.saveAndFlush(databaseRequest);

        int databaseSizeBeforeDelete = databaseRequestRepository.findAll().size();

        // Delete the databaseRequest
        restDatabaseRequestMockMvc
            .perform(delete(ENTITY_API_URL_ID, databaseRequest.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DatabaseRequest> databaseRequestList = databaseRequestRepository.findAll();
        assertThat(databaseRequestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
