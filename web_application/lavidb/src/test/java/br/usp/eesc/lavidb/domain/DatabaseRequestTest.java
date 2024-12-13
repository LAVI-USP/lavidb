package br.usp.eesc.lavidb.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.usp.eesc.lavidb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DatabaseRequestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DatabaseRequest.class);
        DatabaseRequest databaseRequest1 = new DatabaseRequest();
        databaseRequest1.setId(1L);
        DatabaseRequest databaseRequest2 = new DatabaseRequest();
        databaseRequest2.setId(databaseRequest1.getId());
        assertThat(databaseRequest1).isEqualTo(databaseRequest2);
        databaseRequest2.setId(2L);
        assertThat(databaseRequest1).isNotEqualTo(databaseRequest2);
        databaseRequest1.setId(null);
        assertThat(databaseRequest1).isNotEqualTo(databaseRequest2);
    }
}
