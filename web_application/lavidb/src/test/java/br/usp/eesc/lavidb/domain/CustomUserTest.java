package br.usp.eesc.lavidb.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.usp.eesc.lavidb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CustomUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CustomUser.class);
        CustomUser customUser1 = new CustomUser();
        customUser1.setId(1L);
        CustomUser customUser2 = new CustomUser();
        customUser2.setId(customUser1.getId());
        assertThat(customUser1).isEqualTo(customUser2);
        customUser2.setId(2L);
        assertThat(customUser1).isNotEqualTo(customUser2);
        customUser1.setId(null);
        assertThat(customUser1).isNotEqualTo(customUser2);
    }
}
