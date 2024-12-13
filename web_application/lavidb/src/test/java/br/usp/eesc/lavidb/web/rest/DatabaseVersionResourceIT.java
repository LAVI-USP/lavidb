package br.usp.eesc.lavidb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.usp.eesc.lavidb.IntegrationTest;
import br.usp.eesc.lavidb.domain.DatabaseVersion;
import br.usp.eesc.lavidb.repository.DatabaseVersionRepository;
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
 * Integration tests for the {@link DatabaseVersionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DatabaseVersionResourceIT {

    private static final Integer DEFAULT_VERSION_NUMBER = 1;
    private static final Integer UPDATED_VERSION_NUMBER = 2;

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/database-versions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DatabaseVersionRepository databaseVersionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDatabaseVersionMockMvc;

    private DatabaseVersion databaseVersion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DatabaseVersion createEntity(EntityManager em) {
        DatabaseVersion databaseVersion = new DatabaseVersion().versionNumber(DEFAULT_VERSION_NUMBER).createdDate(DEFAULT_CREATED_DATE);
        return databaseVersion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DatabaseVersion createUpdatedEntity(EntityManager em) {
        DatabaseVersion databaseVersion = new DatabaseVersion().versionNumber(UPDATED_VERSION_NUMBER).createdDate(UPDATED_CREATED_DATE);
        return databaseVersion;
    }

    @BeforeEach
    public void initTest() {
        databaseVersion = createEntity(em);
    }

    @Test
    @Transactional
    void createDatabaseVersion() throws Exception {
        int databaseSizeBeforeCreate = databaseVersionRepository.findAll().size();
        // Create the DatabaseVersion
        restDatabaseVersionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isCreated());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeCreate + 1);
        DatabaseVersion testDatabaseVersion = databaseVersionList.get(databaseVersionList.size() - 1);
        assertThat(testDatabaseVersion.getVersionNumber()).isEqualTo(DEFAULT_VERSION_NUMBER);
        assertThat(testDatabaseVersion.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createDatabaseVersionWithExistingId() throws Exception {
        // Create the DatabaseVersion with an existing ID
        databaseVersion.setId(1L);

        int databaseSizeBeforeCreate = databaseVersionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDatabaseVersionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkVersionNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = databaseVersionRepository.findAll().size();
        // set the field null
        databaseVersion.setVersionNumber(null);

        // Create the DatabaseVersion, which fails.

        restDatabaseVersionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isBadRequest());

        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDatabaseVersions() throws Exception {
        // Initialize the database
        databaseVersionRepository.saveAndFlush(databaseVersion);

        // Get all the databaseVersionList
        restDatabaseVersionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(databaseVersion.getId().intValue())))
            .andExpect(jsonPath("$.[*].versionNumber").value(hasItem(DEFAULT_VERSION_NUMBER)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @Test
    @Transactional
    void getDatabaseVersion() throws Exception {
        // Initialize the database
        databaseVersionRepository.saveAndFlush(databaseVersion);

        // Get the databaseVersion
        restDatabaseVersionMockMvc
            .perform(get(ENTITY_API_URL_ID, databaseVersion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(databaseVersion.getId().intValue()))
            .andExpect(jsonPath("$.versionNumber").value(DEFAULT_VERSION_NUMBER))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDatabaseVersion() throws Exception {
        // Get the databaseVersion
        restDatabaseVersionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDatabaseVersion() throws Exception {
        // Initialize the database
        databaseVersionRepository.saveAndFlush(databaseVersion);

        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();

        // Update the databaseVersion
        DatabaseVersion updatedDatabaseVersion = databaseVersionRepository.findById(databaseVersion.getId()).get();
        // Disconnect from session so that the updates on updatedDatabaseVersion are not directly saved in db
        em.detach(updatedDatabaseVersion);
        updatedDatabaseVersion.versionNumber(UPDATED_VERSION_NUMBER).createdDate(UPDATED_CREATED_DATE);

        restDatabaseVersionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDatabaseVersion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDatabaseVersion))
            )
            .andExpect(status().isOk());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
        DatabaseVersion testDatabaseVersion = databaseVersionList.get(databaseVersionList.size() - 1);
        assertThat(testDatabaseVersion.getVersionNumber()).isEqualTo(UPDATED_VERSION_NUMBER);
        assertThat(testDatabaseVersion.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingDatabaseVersion() throws Exception {
        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();
        databaseVersion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDatabaseVersionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, databaseVersion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDatabaseVersion() throws Exception {
        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();
        databaseVersion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseVersionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDatabaseVersion() throws Exception {
        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();
        databaseVersion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseVersionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDatabaseVersionWithPatch() throws Exception {
        // Initialize the database
        databaseVersionRepository.saveAndFlush(databaseVersion);

        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();

        // Update the databaseVersion using partial update
        DatabaseVersion partialUpdatedDatabaseVersion = new DatabaseVersion();
        partialUpdatedDatabaseVersion.setId(databaseVersion.getId());

        partialUpdatedDatabaseVersion.versionNumber(UPDATED_VERSION_NUMBER).createdDate(UPDATED_CREATED_DATE);

        restDatabaseVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDatabaseVersion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDatabaseVersion))
            )
            .andExpect(status().isOk());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
        DatabaseVersion testDatabaseVersion = databaseVersionList.get(databaseVersionList.size() - 1);
        assertThat(testDatabaseVersion.getVersionNumber()).isEqualTo(UPDATED_VERSION_NUMBER);
        assertThat(testDatabaseVersion.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateDatabaseVersionWithPatch() throws Exception {
        // Initialize the database
        databaseVersionRepository.saveAndFlush(databaseVersion);

        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();

        // Update the databaseVersion using partial update
        DatabaseVersion partialUpdatedDatabaseVersion = new DatabaseVersion();
        partialUpdatedDatabaseVersion.setId(databaseVersion.getId());

        partialUpdatedDatabaseVersion.versionNumber(UPDATED_VERSION_NUMBER).createdDate(UPDATED_CREATED_DATE);

        restDatabaseVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDatabaseVersion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDatabaseVersion))
            )
            .andExpect(status().isOk());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
        DatabaseVersion testDatabaseVersion = databaseVersionList.get(databaseVersionList.size() - 1);
        assertThat(testDatabaseVersion.getVersionNumber()).isEqualTo(UPDATED_VERSION_NUMBER);
        assertThat(testDatabaseVersion.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingDatabaseVersion() throws Exception {
        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();
        databaseVersion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDatabaseVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, databaseVersion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDatabaseVersion() throws Exception {
        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();
        databaseVersion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDatabaseVersion() throws Exception {
        int databaseSizeBeforeUpdate = databaseVersionRepository.findAll().size();
        databaseVersion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatabaseVersionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(databaseVersion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DatabaseVersion in the database
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDatabaseVersion() throws Exception {
        // Initialize the database
        databaseVersionRepository.saveAndFlush(databaseVersion);

        int databaseSizeBeforeDelete = databaseVersionRepository.findAll().size();

        // Delete the databaseVersion
        restDatabaseVersionMockMvc
            .perform(delete(ENTITY_API_URL_ID, databaseVersion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DatabaseVersion> databaseVersionList = databaseVersionRepository.findAll();
        assertThat(databaseVersionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
