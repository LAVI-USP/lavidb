package br.usp.eesc.lavidb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CustomUser.
 */
@Entity
@Table(name = "custom_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CustomUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "license_path", nullable = false)
    private String licensePath;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(mappedBy = "customUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "databaseVersion", "customUser" }, allowSetters = true)
    private Set<DatabaseRequest> databaseRequests = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CustomUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicensePath() {
        return this.licensePath;
    }

    public CustomUser licensePath(String licensePath) {
        this.setLicensePath(licensePath);
        return this;
    }

    public void setLicensePath(String licensePath) {
        this.licensePath = licensePath;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public CustomUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Set<DatabaseRequest> getDatabaseRequests() {
        return this.databaseRequests;
    }

    public void setDatabaseRequests(Set<DatabaseRequest> databaseRequests) {
        if (this.databaseRequests != null) {
            this.databaseRequests.forEach(i -> i.setCustomUser(null));
        }
        if (databaseRequests != null) {
            databaseRequests.forEach(i -> i.setCustomUser(this));
        }
        this.databaseRequests = databaseRequests;
    }

    public CustomUser databaseRequests(Set<DatabaseRequest> databaseRequests) {
        this.setDatabaseRequests(databaseRequests);
        return this;
    }

    public CustomUser addDatabaseRequest(DatabaseRequest databaseRequest) {
        this.databaseRequests.add(databaseRequest);
        databaseRequest.setCustomUser(this);
        return this;
    }

    public CustomUser removeDatabaseRequest(DatabaseRequest databaseRequest) {
        this.databaseRequests.remove(databaseRequest);
        databaseRequest.setCustomUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CustomUser)) {
            return false;
        }
        return id != null && id.equals(((CustomUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }
}
