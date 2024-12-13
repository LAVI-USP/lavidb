package br.usp.eesc.lavidb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.usp.eesc.lavidb.IntegrationTest;
import br.usp.eesc.lavidb.domain.IrradiationEvent;
import br.usp.eesc.lavidb.repository.IrradiationEventRepository;
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
 * Integration tests for the {@link IrradiationEventResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IrradiationEventResourceIT {

    private static final Integer DEFAULT_RELATIVE_XRAY_EXPOSURE = 1;
    private static final Integer UPDATED_RELATIVE_XRAY_EXPOSURE = 2;

    private static final String DEFAULT_KVP = "AAAAAAAAAA";
    private static final String UPDATED_KVP = "BBBBBBBBBB";

    private static final Float DEFAULT_DOSEM_AS = 1F;
    private static final Float UPDATED_DOSEM_AS = 2F;

    private static final Float DEFAULT_DOSEM_GY = 1F;
    private static final Float UPDATED_DOSEM_GY = 2F;

    private static final String ENTITY_API_URL = "/api/irradiation-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IrradiationEventRepository irradiationEventRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIrradiationEventMockMvc;

    private IrradiationEvent irradiationEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IrradiationEvent createEntity(EntityManager em) {
        IrradiationEvent irradiationEvent = new IrradiationEvent()
            .relativeXrayExposure(DEFAULT_RELATIVE_XRAY_EXPOSURE)
            .kvp(DEFAULT_KVP)
            .dosemAs(DEFAULT_DOSEM_AS)
            .dosemGy(DEFAULT_DOSEM_GY);
        return irradiationEvent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IrradiationEvent createUpdatedEntity(EntityManager em) {
        IrradiationEvent irradiationEvent = new IrradiationEvent()
            .relativeXrayExposure(UPDATED_RELATIVE_XRAY_EXPOSURE)
            .kvp(UPDATED_KVP)
            .dosemAs(UPDATED_DOSEM_AS)
            .dosemGy(UPDATED_DOSEM_GY);
        return irradiationEvent;
    }

    @BeforeEach
    public void initTest() {
        irradiationEvent = createEntity(em);
    }

    @Test
    @Transactional
    void createIrradiationEvent() throws Exception {
        int databaseSizeBeforeCreate = irradiationEventRepository.findAll().size();
        // Create the IrradiationEvent
        restIrradiationEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isCreated());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeCreate + 1);
        IrradiationEvent testIrradiationEvent = irradiationEventList.get(irradiationEventList.size() - 1);
        assertThat(testIrradiationEvent.getRelativeXrayExposure()).isEqualTo(DEFAULT_RELATIVE_XRAY_EXPOSURE);
        assertThat(testIrradiationEvent.getKvp()).isEqualTo(DEFAULT_KVP);
        assertThat(testIrradiationEvent.getDosemAs()).isEqualTo(DEFAULT_DOSEM_AS);
        assertThat(testIrradiationEvent.getDosemGy()).isEqualTo(DEFAULT_DOSEM_GY);
    }

    @Test
    @Transactional
    void createIrradiationEventWithExistingId() throws Exception {
        // Create the IrradiationEvent with an existing ID
        irradiationEvent.setId(1L);

        int databaseSizeBeforeCreate = irradiationEventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIrradiationEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRelativeXrayExposureIsRequired() throws Exception {
        int databaseSizeBeforeTest = irradiationEventRepository.findAll().size();
        // set the field null
        irradiationEvent.setRelativeXrayExposure(null);

        // Create the IrradiationEvent, which fails.

        restIrradiationEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkKvpIsRequired() throws Exception {
        int databaseSizeBeforeTest = irradiationEventRepository.findAll().size();
        // set the field null
        irradiationEvent.setKvp(null);

        // Create the IrradiationEvent, which fails.

        restIrradiationEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDosemAsIsRequired() throws Exception {
        int databaseSizeBeforeTest = irradiationEventRepository.findAll().size();
        // set the field null
        irradiationEvent.setDosemAs(null);

        // Create the IrradiationEvent, which fails.

        restIrradiationEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDosemGyIsRequired() throws Exception {
        int databaseSizeBeforeTest = irradiationEventRepository.findAll().size();
        // set the field null
        irradiationEvent.setDosemGy(null);

        // Create the IrradiationEvent, which fails.

        restIrradiationEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIrradiationEvents() throws Exception {
        // Initialize the database
        irradiationEventRepository.saveAndFlush(irradiationEvent);

        // Get all the irradiationEventList
        restIrradiationEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(irradiationEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].relativeXrayExposure").value(hasItem(DEFAULT_RELATIVE_XRAY_EXPOSURE)))
            .andExpect(jsonPath("$.[*].kvp").value(hasItem(DEFAULT_KVP)))
            .andExpect(jsonPath("$.[*].dosemAs").value(hasItem(DEFAULT_DOSEM_AS.doubleValue())))
            .andExpect(jsonPath("$.[*].dosemGy").value(hasItem(DEFAULT_DOSEM_GY.doubleValue())));
    }

    @Test
    @Transactional
    void getIrradiationEvent() throws Exception {
        // Initialize the database
        irradiationEventRepository.saveAndFlush(irradiationEvent);

        // Get the irradiationEvent
        restIrradiationEventMockMvc
            .perform(get(ENTITY_API_URL_ID, irradiationEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(irradiationEvent.getId().intValue()))
            .andExpect(jsonPath("$.relativeXrayExposure").value(DEFAULT_RELATIVE_XRAY_EXPOSURE))
            .andExpect(jsonPath("$.kvp").value(DEFAULT_KVP))
            .andExpect(jsonPath("$.dosemAs").value(DEFAULT_DOSEM_AS.doubleValue()))
            .andExpect(jsonPath("$.dosemGy").value(DEFAULT_DOSEM_GY.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingIrradiationEvent() throws Exception {
        // Get the irradiationEvent
        restIrradiationEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingIrradiationEvent() throws Exception {
        // Initialize the database
        irradiationEventRepository.saveAndFlush(irradiationEvent);

        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();

        // Update the irradiationEvent
        IrradiationEvent updatedIrradiationEvent = irradiationEventRepository.findById(irradiationEvent.getId()).get();
        // Disconnect from session so that the updates on updatedIrradiationEvent are not directly saved in db
        em.detach(updatedIrradiationEvent);
        updatedIrradiationEvent
            .relativeXrayExposure(UPDATED_RELATIVE_XRAY_EXPOSURE)
            .kvp(UPDATED_KVP)
            .dosemAs(UPDATED_DOSEM_AS)
            .dosemGy(UPDATED_DOSEM_GY);

        restIrradiationEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIrradiationEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIrradiationEvent))
            )
            .andExpect(status().isOk());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
        IrradiationEvent testIrradiationEvent = irradiationEventList.get(irradiationEventList.size() - 1);
        assertThat(testIrradiationEvent.getRelativeXrayExposure()).isEqualTo(UPDATED_RELATIVE_XRAY_EXPOSURE);
        assertThat(testIrradiationEvent.getKvp()).isEqualTo(UPDATED_KVP);
        assertThat(testIrradiationEvent.getDosemAs()).isEqualTo(UPDATED_DOSEM_AS);
        assertThat(testIrradiationEvent.getDosemGy()).isEqualTo(UPDATED_DOSEM_GY);
    }

    @Test
    @Transactional
    void putNonExistingIrradiationEvent() throws Exception {
        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();
        irradiationEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIrradiationEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, irradiationEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIrradiationEvent() throws Exception {
        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();
        irradiationEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIrradiationEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIrradiationEvent() throws Exception {
        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();
        irradiationEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIrradiationEventMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIrradiationEventWithPatch() throws Exception {
        // Initialize the database
        irradiationEventRepository.saveAndFlush(irradiationEvent);

        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();

        // Update the irradiationEvent using partial update
        IrradiationEvent partialUpdatedIrradiationEvent = new IrradiationEvent();
        partialUpdatedIrradiationEvent.setId(irradiationEvent.getId());

        partialUpdatedIrradiationEvent
            .relativeXrayExposure(UPDATED_RELATIVE_XRAY_EXPOSURE)
            .dosemAs(UPDATED_DOSEM_AS)
            .dosemGy(UPDATED_DOSEM_GY);

        restIrradiationEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIrradiationEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIrradiationEvent))
            )
            .andExpect(status().isOk());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
        IrradiationEvent testIrradiationEvent = irradiationEventList.get(irradiationEventList.size() - 1);
        assertThat(testIrradiationEvent.getRelativeXrayExposure()).isEqualTo(UPDATED_RELATIVE_XRAY_EXPOSURE);
        assertThat(testIrradiationEvent.getKvp()).isEqualTo(DEFAULT_KVP);
        assertThat(testIrradiationEvent.getDosemAs()).isEqualTo(UPDATED_DOSEM_AS);
        assertThat(testIrradiationEvent.getDosemGy()).isEqualTo(UPDATED_DOSEM_GY);
    }

    @Test
    @Transactional
    void fullUpdateIrradiationEventWithPatch() throws Exception {
        // Initialize the database
        irradiationEventRepository.saveAndFlush(irradiationEvent);

        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();

        // Update the irradiationEvent using partial update
        IrradiationEvent partialUpdatedIrradiationEvent = new IrradiationEvent();
        partialUpdatedIrradiationEvent.setId(irradiationEvent.getId());

        partialUpdatedIrradiationEvent
            .relativeXrayExposure(UPDATED_RELATIVE_XRAY_EXPOSURE)
            .kvp(UPDATED_KVP)
            .dosemAs(UPDATED_DOSEM_AS)
            .dosemGy(UPDATED_DOSEM_GY);

        restIrradiationEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIrradiationEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIrradiationEvent))
            )
            .andExpect(status().isOk());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
        IrradiationEvent testIrradiationEvent = irradiationEventList.get(irradiationEventList.size() - 1);
        assertThat(testIrradiationEvent.getRelativeXrayExposure()).isEqualTo(UPDATED_RELATIVE_XRAY_EXPOSURE);
        assertThat(testIrradiationEvent.getKvp()).isEqualTo(UPDATED_KVP);
        assertThat(testIrradiationEvent.getDosemAs()).isEqualTo(UPDATED_DOSEM_AS);
        assertThat(testIrradiationEvent.getDosemGy()).isEqualTo(UPDATED_DOSEM_GY);
    }

    @Test
    @Transactional
    void patchNonExistingIrradiationEvent() throws Exception {
        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();
        irradiationEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIrradiationEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, irradiationEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIrradiationEvent() throws Exception {
        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();
        irradiationEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIrradiationEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIrradiationEvent() throws Exception {
        int databaseSizeBeforeUpdate = irradiationEventRepository.findAll().size();
        irradiationEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIrradiationEventMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(irradiationEvent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IrradiationEvent in the database
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIrradiationEvent() throws Exception {
        // Initialize the database
        irradiationEventRepository.saveAndFlush(irradiationEvent);

        int databaseSizeBeforeDelete = irradiationEventRepository.findAll().size();

        // Delete the irradiationEvent
        restIrradiationEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, irradiationEvent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<IrradiationEvent> irradiationEventList = irradiationEventRepository.findAll();
        assertThat(irradiationEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
