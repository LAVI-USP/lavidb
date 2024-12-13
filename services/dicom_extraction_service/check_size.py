import pathlib
import pydicom
import pydicom._storage_sopclass_uids
import numpy as np
import os
from utils import writeDecompressedDicomLibra


def check_size():

    silver = pathlib.Path("decompressed")
    files = list(silver.rglob("*.dcm"))
    i = 0
    if files:
        #self.logger.info(f"Found {len(files)} files!")
        for file in files:
            file = str(file)
            img =  pydicom.dcmread(file).pixel_array
            img_shape = img.shape
            if img_shape == (2850,2394) :            
                file_name = file.split('/')[1]
                print(file_name)
                os.system(f"mv {file} for_crop/{file_name}")        
                i = i +1
        print(f"total files {i}")        


def crop_img():
    file = 'for_crop/45.dcm'
    img = pydicom.dcmread(file).pixel_array.astype(np.float32)
    #cropped = img[332 : 2626, 0: 1914]
    #cropped = img[312 : 2606, 0 : 1914] #left
    cropped = img[236 : 2530, 480 : 2394] #right 
    dcmHdr = pydicom.dcmread(file)
    writeDecompressedDicomLibra(dcmFileName=f"cropped/45.dcm",dcmImg=cropped, dcmHdr=dcmHdr, crop=True)
    
    
### LEFT
#     0,312    
#   1914,2606

### RIGHT
#    480,236
#    2394,2530

 
crop_img()
#check_size()    


# ORIGINAL (2294,1914)

## 5.dcm
#up  #480,200
#low #2394,2494

## 9.dcm
#up  #0,324
#low #1914,2618

## 10.dcm
#up  #0,228
#low #1914,2522

## 17.dcm
#RIGHT

## 18.dcm
#RIGHT

## 19.dcm
#up  #0,260
#low #1914,2554

## 22.dcm
#up  #0,260
#low #1914,2554

#LEFT
#up  #480,192
#low #2394,2486

## RIGHT
#up  #0,190
#low #194,2484

## 24.dcm
#up  #480,328
#low #2394,2622

## 25.dcm
#RIGHT

## 47.dcm
#up  #0,366
#low #1914,2660

## 51.dcm
#up 476,48
#low 2390,2342 [

## 61.dcm
#up 480,408
#low 2394,2702 ]

## 63.dcm
#up 476,256
#low 2390,2550

## 86.dcm
#up  0,400
#low 1914,2694


## 99.dcm
#up   60,  318
#low  1974,2612

## 113.dcm
#up   0,  332
#low  1914,2626
