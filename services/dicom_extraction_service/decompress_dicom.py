import pydicom
import pydicom._storage_sopclass_uids
import decimal
import numpy as np
import pathlib
import os
from utils import writeDecompressedDicomLibra


#file = '1.2.840.113619.2.401.1011171223172116.11866211005094930.59.dcm'
#file = 'generated.dcm'
#file = '1.2.840.113619.2.401.1011171223172116.32590211004142939.90.dcm'

silver = pathlib.Path("silver")
files = list(silver.rglob("*.dcm"))
i = 1
if files:
    #self.logger.info(f"Found {len(files)} files!")
    for file in files:
        file = str(file)
        img =  pydicom.dcmread(file).pixel_array
        dcmHdr = pydicom.dcmread(file)
        os.system(f"cp {file}  gold/{i}.dcm")
        #utils.change_header_libra(file, 'generated.dcm')
        writeDecompressedDicomLibra(dcmFileName=f"decompressed/{i}.dcm",dcmImg=img, dcmHdr=dcmHdr)
        i = i+1


# 3
# 10
# 14  
# 18
# 21
# 23
# 24
# 29
# 31
# 33
# 35
# 38
# 105
# 117
# 43
# 45
# 46
# 47
# 49
# 51  
# 6
# 67
# 68
# 69
# 7
# 71
# 72
# 73
# 74
# 78
# 86
# 88
# 89
# 92
# 93
# 95
# 97
# 99