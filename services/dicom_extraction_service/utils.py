import pydicom
import pydicom._storage_sopclass_uids
import numpy as np

def writeDecompressedDicomLibra(dcmFileName, dcmImg, dcmHdr, crop=False):
    '''
    
    Description: Write empty Dicom file
    
    Input:
        - dcmFileName = File name, e.g. "myDicom.dcm".
        - dcmImg = image np array
    
    Output:
        - 
            
    
    Source:
    
    '''
        
    dcmImg = dcmImg.astype(np.uint16)

    # print("Setting file meta information...")

    # Populate required values for file meta information
    meta = pydicom.dataset.FileMetaDataset() 
    meta.MediaStorageSOPClassUID = pydicom._storage_sopclass_uids.DigitalMammographyXRayImageStorageForProcessing
    meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
    meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian  
    
    ds = pydicom.dataset.FileDataset(dcmFileName, {}, file_meta=meta, preamble=b"\0" * 128)
    
    ds.is_little_endian = True
    ds.is_implicit_VR = False
    
    ds.SOPClassUID = pydicom._storage_sopclass_uids.DigitalMammographyXRayImageStorageForProcessing
    ds.PatientID = dcmHdr.PatientID
    
    ds.Modality = dcmHdr.Modality
    ds.SeriesInstanceUID = pydicom.uid.generate_uid()
    ds.StudyInstanceUID = pydicom.uid.generate_uid()
    ds.FrameOfReferenceUID = pydicom.uid.generate_uid()
    
    ds.BitsStored = 16
    ds.BitsAllocated = 16
    ds.SamplesPerPixel = 1
    ds.HighBit = 16
    
    ds.ColorType = 'grayscale'
    ds.PresentationIntentType=dcmHdr.PresentationIntentType
    ds.Manufacturer= dcmHdr.Manufacturer
    ds.KVP= dcmHdr.KVP
    ds.ExposureTime=dcmHdr.ExposureTime
    ds.XRayTubeCurrent=dcmHdr.XRayTubeCurrent
    ds.Exposure=dcmHdr.Exposure
    ds.ExposureInuAs=dcmHdr.ExposureInuAs
    ds.FilterType= 'STRIP'
    ds.ImagerPixelSpacing=  dcmHdr.ImagerPixelSpacing
    ds.BodyPartThickness=dcmHdr.BodyPartThickness
    ds.CompressionForce=dcmHdr.CompressionForce
    ds.ViewPosition=dcmHdr.ViewPosition
    ds.PatientOrientation=dcmHdr.PatientOrientation
    ds.ImageLaterality=dcmHdr.ImageLaterality
    ds.ImagesInAcquisition=1
    ds.SamplesPerPixel=dcmHdr.SamplesPerPixel
    ds.PhotometricInterpretation=dcmHdr.PhotometricInterpretation
    
    if crop:
        ds.Rows = 2294
        ds.Columns = 1914
    else:    
        ds.Rows = dcmHdr.Rows
        ds.Columns = dcmHdr.Columns
    ds.PixelRepresentation = 1
    ds.AccessionNumber = dcmHdr.AccessionNumber
    ds.AcquisitionDate = dcmHdr.AcquisitionDate
    ds.ManufacturerModelName = dcmHdr.ManufacturerModelName
    
    
    ds.RelativeXRayExposure = dcmHdr.RelativeXRayExposure
    ds.EntranceDoseInmGy = dcmHdr.EntranceDoseInmGy
    ds.PatientName = dcmHdr.PatientName
    ds.PatientSex = dcmHdr.PatientSex
    ds.PatientBirthDate = dcmHdr.PatientBirthDate
    ds.PatientAge = dcmHdr.PatientAge
    
    dcmHdr.InstitutionName = dcmHdr.PatientAge
    dcmHdr.InstitutionalDepartmentName = dcmHdr.PatientAge
    ds.SOPInstanceUID = dcmHdr.SOPInstanceUID

    ds.PixelData = dcmImg.tobytes()
    
    ds.save_as(dcmFileName)
    
    return