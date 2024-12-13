package br.usp.eesc.lavidb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DatabaseRequest.
 */
@Entity
@Table(name = "database_request")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DatabaseRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "parameters", nullable = false)
    private String parameters;

    @Column(name = "created_date")
    private Instant createdDate;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "download_link")
    private String downloadLink;

    @ManyToOne(fetch = FetchType.EAGER)
    private DatabaseVersion databaseVersion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "internalUser", "databaseRequests" }, allowSetters = true)
    private CustomUser customUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DatabaseRequest id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getParameters() {
        return this.parameters;
    }

    public DatabaseRequest parameters(String parameters) {
        this.setParameters(parameters);
        return this;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public DatabaseRequest createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getExpiresAt() {
        return this.expiresAt;
    }

    public DatabaseRequest expiresAt(Instant expiresAt) {
        this.setExpiresAt(expiresAt);
        return this;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getDownloadLink() {
        return this.downloadLink;
    }

    public DatabaseRequest downloadLink(String downloadLink) {
        this.setDownloadLink(downloadLink);
        return this;
    }

    public void setDownloadLink(String downloadLink) {
        this.downloadLink = downloadLink;
    }

    public DatabaseVersion getDatabaseVersion() {
        return this.databaseVersion;
    }

    public void setDatabaseVersion(DatabaseVersion databaseVersion) {
        this.databaseVersion = databaseVersion;
    }

    public DatabaseRequest databaseVersion(DatabaseVersion databaseVersion) {
        this.setDatabaseVersion(databaseVersion);
        return this;
    }

    public CustomUser getCustomUser() {
        return this.customUser;
    }

    public void setCustomUser(CustomUser customUser) {
        this.customUser = customUser;
    }

    public DatabaseRequest customUser(CustomUser customUser) {
        this.setCustomUser(customUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DatabaseRequest)) {
            return false;
        }
        return id != null && id.equals(((DatabaseRequest) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "{" +
            "id:" + getId() +
            ", parameters:'" + getParameters() + "'" +
            ", createdDate:'" + getCreatedDate() + "'" +
            ", expiresAt:'" + getExpiresAt() + "'" +
            ", downloadLink:'" + getDownloadLink() + "'" +
            "}";
    }

    public String toJSON() {
        String json = "";
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            ObjectWriter ow = objectMapper.writer().withDefaultPrettyPrinter();
            json = ow.writeValueAsString(this);
        } catch (JsonProcessingException ex) {
            System.out.println(ex.getMessage());
        }
        return json;
    }
}
