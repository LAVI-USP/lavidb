package br.usp.eesc.lavidb.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.usp.eesc.lavidb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DatabaseVersionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DatabaseVersion.class);
        DatabaseVersion databaseVersion1 = new DatabaseVersion();
        databaseVersion1.setId(1L);
        DatabaseVersion databaseVersion2 = new DatabaseVersion();
        databaseVersion2.setId(databaseVersion1.getId());
        assertThat(databaseVersion1).isEqualTo(databaseVersion2);
        databaseVersion2.setId(2L);
        assertThat(databaseVersion1).isNotEqualTo(databaseVersion2);
        databaseVersion1.setId(null);
        assertThat(databaseVersion1).isNotEqualTo(databaseVersion2);
    }
}
