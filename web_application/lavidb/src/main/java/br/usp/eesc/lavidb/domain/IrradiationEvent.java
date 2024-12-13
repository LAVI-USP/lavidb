package br.usp.eesc.lavidb.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A IrradiationEvent.
 */
@Entity
@Table(name = "irradiation_event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class IrradiationEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "relative_xray_exposure", nullable = false)
    private Integer relativeXrayExposure;

    @NotNull
    @Column(name = "kvp", nullable = false)
    private String kvp;

    @NotNull
    @Column(name = "dosem_as", nullable = false)
    private Float dosemAs;

    @NotNull
    @Column(name = "dosem_gy", nullable = false)
    private Float dosemGy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public IrradiationEvent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRelativeXrayExposure() {
        return this.relativeXrayExposure;
    }

    public IrradiationEvent relativeXrayExposure(Integer relativeXrayExposure) {
        this.setRelativeXrayExposure(relativeXrayExposure);
        return this;
    }

    public void setRelativeXrayExposure(Integer relativeXrayExposure) {
        this.relativeXrayExposure = relativeXrayExposure;
    }

    public String getKvp() {
        return this.kvp;
    }

    public IrradiationEvent kvp(String kvp) {
        this.setKvp(kvp);
        return this;
    }

    public void setKvp(String kvp) {
        this.kvp = kvp;
    }

    public Float getDosemAs() {
        return this.dosemAs;
    }

    public IrradiationEvent dosemAs(Float dosemAs) {
        this.setDosemAs(dosemAs);
        return this;
    }

    public void setDosemAs(Float dosemAs) {
        this.dosemAs = dosemAs;
    }

    public Float getDosemGy() {
        return this.dosemGy;
    }

    public IrradiationEvent dosemGy(Float dosemGy) {
        this.setDosemGy(dosemGy);
        return this;
    }

    public void setDosemGy(Float dosemGy) {
        this.dosemGy = dosemGy;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof IrradiationEvent)) {
            return false;
        }
        return id != null && id.equals(((IrradiationEvent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "IrradiationEvent{" +
            "id=" + getId() +
            ", relativeXrayExposure=" + getRelativeXrayExposure() +
            ", kvp='" + getKvp() + "'" +
            ", dosemAs=" + getDosemAs() +
            ", dosemGy=" + getDosemGy() +
            "}";
    }
}
