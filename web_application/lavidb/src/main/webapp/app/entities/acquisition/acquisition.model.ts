import dayjs from 'dayjs/esm';
import { IManufacturer } from 'app/entities/manufacturer/manufacturer.model';
import { IIrradiationEvent } from 'app/entities/irradiation-event/irradiation-event.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { IDiagnostic } from 'app/entities/diagnostic/diagnostic.model';
import { IInstitution } from 'app/entities/institution/institution.model';
import { IDatabaseVersion } from 'app/entities/database-version/database-version.model';

export interface IAcquisition {
  id: number;
  accessionNumber?: string | null;
  acquisitionDate?: dayjs.Dayjs | null;
  imageLaterality?: string | null;
  viewPosition?: string | null;
  imagePath?: string | null;
  imageRaw?: string | null;
  thumbPath?: string | null;
  version?: string | null;
  databaseVersion?: Pick<IDatabaseVersion, 'id' | 'versionNumber'> | null;
  manufacturer?: Pick<IManufacturer, 'id' | 'name' | 'model' | 'modality'> | null;
  irradiationEvent?: Pick<IIrradiationEvent, 'id' | 'dosemAs' | 'kvp' | 'dosemGy'> | null;
  patient?: Pick<IPatient, 'id' | 'name' | 'birthDate' | 'age'> | null;
  diagnostic?: Pick<IDiagnostic, 'id' | 'birads'> | null;
  institution?: Pick<IInstitution, 'id' | 'name' | 'department'> | null;
}

export type NewAcquisition = Omit<IAcquisition, 'id'> & { id: null };
