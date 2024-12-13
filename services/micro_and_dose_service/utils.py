import pydicom
import pydicom._storage_sopclass_uids
import numpy as np


def writeDecompressedDicomLibra(dcmFileName, dcmImg, dcmHdr, file_name, crop=False):
    """

    Description: Write empty Dicom file

    Input:
        - dcmFileName = File name, e.g. "myDicom.dcm".
        - dcmImg = image np array

    Output:
        -


    Source:

    """

    dcmImg = dcmImg.astype(np.uint16)

    # print("Setting file meta information...")

    # Populate required values for file meta information
    meta = pydicom.dataset.FileMetaDataset()
    meta.MediaStorageSOPClassUID = (
        pydicom._storage_sopclass_uids.DigitalMammographyXRayImageStorageForProcessing
    )
    meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
    meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian

    ds = pydicom.dataset.FileDataset(
        dcmFileName, {}, file_meta=meta, preamble=b"\0" * 128
    )

    ds.is_little_endian = True
    ds.is_implicit_VR = False

    ds.SOPClassUID = (
        pydicom._storage_sopclass_uids.DigitalMammographyXRayImageStorageForProcessing
    )
    ds.PatientID = dcmHdr.PatientID

    ds.Modality = dcmHdr.Modality
    ds.SeriesInstanceUID = pydicom.uid.generate_uid()
    ds.StudyInstanceUID = pydicom.uid.generate_uid()
    ds.FrameOfReferenceUID = pydicom.uid.generate_uid()

    ds.BitsStored = dcmHdr.BitsStored
    ds.BitsAllocated = dcmHdr.BitsAllocated
    ds.SamplesPerPixel = dcmHdr.SamplesPerPixel
    ds.HighBit = dcmHdr.HighBit

    #ds.ColorType = "grayscale"
    #ds.ColorType = dcmHdr.ColorType
    ds.PresentationIntentType = dcmHdr.PresentationIntentType
    ds.Manufacturer = dcmHdr.Manufacturer
    ds.KVP = dcmHdr.KVP
    ds.ExposureTime = dcmHdr.ExposureTime
    ds.XRayTubeCurrent = dcmHdr.XRayTubeCurrent
    ds.Exposure = dcmHdr.Exposure
    ds.ExposureInuAs = dcmHdr.ExposureInuAs
    #ds.FilterType = "STRIP"
    ds.FilterType = dcmHdr.FilterType
    ds.ImagerPixelSpacing = dcmHdr.ImagerPixelSpacing
    ds.BodyPartThickness = dcmHdr.BodyPartThickness
    ds.CompressionForce = dcmHdr.CompressionForce
    ds.ViewPosition = dcmHdr.ViewPosition
    ds.PatientOrientation = dcmHdr.PatientOrientation
    ds.ImageLaterality = dcmHdr.ImageLaterality
    ds.ImagesInAcquisition = 1
    ds.SamplesPerPixel = dcmHdr.SamplesPerPixel
    ds.PhotometricInterpretation = dcmHdr.PhotometricInterpretation

    if crop:
        ds.Rows = 2294
        ds.Columns = 1914
    else:
        ds.Rows = dcmHdr.Rows
        ds.Columns = dcmHdr.Columns
    ds.PixelRepresentation = 1
    ds.AccessionNumber = file_name
    ds.AcquisitionDate = dcmHdr.AcquisitionDate
    ds.ManufacturerModelName = dcmHdr.ManufacturerModelName

    ds.RelativeXRayExposure = dcmHdr.RelativeXRayExposure
    ds.EntranceDoseInmGy = dcmHdr.EntranceDoseInmGy
    
    ds.PatientName = file_name
    ds.PatientSex = dcmHdr.PatientSex
    ds.PatientBirthDate = dcmHdr.PatientBirthDate
    ds.PatientAge = dcmHdr.PatientAge

    ds.InstitutionName = 'Image generated from LAVIDB'
    ds.SOPInstanceUID = dcmHdr.SOPInstanceUID

    # block = ds.private_block(0x000b, "SimulationAttributes", create=True)
    # block.add_new(0x01, "SH", "LesionCoords: [1021,2100]")
    # block.add_new(0x02, "SH", "NrLesions: 8")
    # block.add_new(0x03, "SH", "Dose: 232 mGy")

    #ds.add_new(0x19100e, 'FD', [0,1,0])    

    ds.PixelData = dcmImg.tobytes()

    ds.save_as(dcmFileName)

    return


# file = '/home/zanelato/Documents/workspace/lavidb_pipe/gold/2.dcm'

# dcmHdr = pydicom.dcmread(file)
# dcmData = pydicom.dcmread(file).pixel_array.astype(np.float32)


# writeDecompressedDicomLibra(
#                     dcmFileName="2_32.dcm",
#                     dcmImg=dcmData,
#                     dcmHdr=dcmHdr,
#                     file_name="1"
#                 )
