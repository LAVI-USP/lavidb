package br.usp.eesc.lavidb.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.usp.eesc.lavidb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IrradiationEventTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IrradiationEvent.class);
        IrradiationEvent irradiationEvent1 = new IrradiationEvent();
        irradiationEvent1.setId(1L);
        IrradiationEvent irradiationEvent2 = new IrradiationEvent();
        irradiationEvent2.setId(irradiationEvent1.getId());
        assertThat(irradiationEvent1).isEqualTo(irradiationEvent2);
        irradiationEvent2.setId(2L);
        assertThat(irradiationEvent1).isNotEqualTo(irradiationEvent2);
        irradiationEvent1.setId(null);
        assertThat(irradiationEvent1).isNotEqualTo(irradiationEvent2);
    }
}
