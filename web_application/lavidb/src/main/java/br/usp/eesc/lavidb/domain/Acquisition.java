package br.usp.eesc.lavidb.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Acquisition.
 */
@Entity
@Table(name = "acquisition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Acquisition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "accession_number", nullable = false)
    private String accessionNumber;

    @NotNull
    @Column(name = "acquisition_date", nullable = false)
    private Instant acquisitionDate;

    @NotNull
    @Column(name = "image_laterality", nullable = false)
    private String imageLaterality;

    @NotNull
    @Column(name = "view_position", nullable = false)
    private String viewPosition;

    @NotNull
    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @NotNull
    @Column(name = "image_raw", nullable = false)
    private String imageRaw;

    @NotNull
    @Column(name = "thumb_path", nullable = false)
    private String thumbPath;

    @ManyToOne(fetch = FetchType.EAGER)
    private Manufacturer manufacturer;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private IrradiationEvent irradiationEvent;

    @ManyToOne(fetch = FetchType.EAGER)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    private Diagnostic diagnostic;

    @ManyToOne(fetch = FetchType.EAGER)
    private Institution institution;

    @ManyToOne(fetch = FetchType.EAGER)
    private DatabaseVersion databaseVersion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Acquisition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccessionNumber() {
        return this.accessionNumber;
    }

    public Acquisition accessionNumber(String accessionNumber) {
        this.setAccessionNumber(accessionNumber);
        return this;
    }

    public void setAccessionNumber(String accessionNumber) {
        this.accessionNumber = accessionNumber;
    }

    public Instant getAcquisitionDate() {
        return this.acquisitionDate;
    }

    public Acquisition acquisitionDate(Instant acquisitionDate) {
        this.setAcquisitionDate(acquisitionDate);
        return this;
    }

    public void setAcquisitionDate(Instant acquisitionDate) {
        this.acquisitionDate = acquisitionDate;
    }

    public String getImageLaterality() {
        return this.imageLaterality;
    }

    public Acquisition imageLaterality(String imageLaterality) {
        this.setImageLaterality(imageLaterality);
        return this;
    }

    public void setImageLaterality(String imageLaterality) {
        this.imageLaterality = imageLaterality;
    }

    public String getViewPosition() {
        return this.viewPosition;
    }

    public Acquisition viewPosition(String viewPosition) {
        this.setViewPosition(viewPosition);
        return this;
    }

    public void setViewPosition(String viewPosition) {
        this.viewPosition = viewPosition;
    }

    public String getImagePath() {
        return this.imagePath;
    }

    public Acquisition imagePath(String imagePath) {
        this.setImagePath(imagePath);
        return this;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getImageRaw() {
        return this.imageRaw;
    }

    public Acquisition imageRaw(String imageRaw) {
        this.setImageRaw(imageRaw);
        return this;
    }

    public void setImageRaw(String imageRaw) {
        this.imageRaw = imageRaw;
    }

    public String getThumbPath() {
        return this.thumbPath;
    }

    public Acquisition thumbPath(String thumbPath) {
        this.setThumbPath(thumbPath);
        return this;
    }

    public void setThumbPath(String thumbPath) {
        this.thumbPath = thumbPath;
    }

    public DatabaseVersion getDatabaseVersion() {
        return databaseVersion;
    }

    public void setDatabaseVersion(DatabaseVersion databaseVersion) {
        this.databaseVersion = databaseVersion;
    }

    public Manufacturer getManufacturer() {
        return this.manufacturer;
    }

    public void setManufacturer(Manufacturer manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Acquisition manufacturer(Manufacturer manufacturer) {
        this.setManufacturer(manufacturer);
        return this;
    }

    public IrradiationEvent getIrradiationEvent() {
        return this.irradiationEvent;
    }

    public void setIrradiationEvent(IrradiationEvent irradiationEvent) {
        this.irradiationEvent = irradiationEvent;
    }

    public Acquisition irradiationEvent(IrradiationEvent irradiationEvent) {
        this.setIrradiationEvent(irradiationEvent);
        return this;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Acquisition patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public Diagnostic getDiagnostic() {
        return this.diagnostic;
    }

    public void setDiagnostic(Diagnostic diagnostic) {
        this.diagnostic = diagnostic;
    }

    public Acquisition diagnostic(Diagnostic diagnostic) {
        this.setDiagnostic(diagnostic);
        return this;
    }

    public Institution getInstitution() {
        return this.institution;
    }

    public void setInstitution(Institution institution) {
        this.institution = institution;
    }

    public Acquisition institution(Institution institution) {
        this.setInstitution(institution);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Acquisition)) {
            return false;
        }
        return id != null && id.equals(((Acquisition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Acquisition{" +
            "id=" + getId() +
            ", accessionNumber='" + getAccessionNumber() + "'" +
            ", acquisitionDate='" + getAcquisitionDate() + "'" +
            ", imageLaterality='" + getImageLaterality() + "'" +
            ", viewPosition='" + getViewPosition() + "'" +
            ", imagePath='" + getImagePath() + "'" +
            ", imageRaw='" + getImageRaw() + "'" +
            ", thumbPath='" + getThumbPath() + "'" +
            "}";
    }
}
