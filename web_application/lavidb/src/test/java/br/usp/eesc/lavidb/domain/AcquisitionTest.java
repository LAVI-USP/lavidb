package br.usp.eesc.lavidb.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.usp.eesc.lavidb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AcquisitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Acquisition.class);
        Acquisition acquisition1 = new Acquisition();
        acquisition1.setId(1L);
        Acquisition acquisition2 = new Acquisition();
        acquisition2.setId(acquisition1.getId());
        assertThat(acquisition1).isEqualTo(acquisition2);
        acquisition2.setId(2L);
        assertThat(acquisition1).isNotEqualTo(acquisition2);
        acquisition1.setId(null);
        assertThat(acquisition1).isNotEqualTo(acquisition2);
    }
}
