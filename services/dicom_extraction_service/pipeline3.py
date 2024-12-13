import pydicom
import matplotlib.pyplot as plt
import json
import copy
import pathlib
from datetime import datetime
import requests
import schedule
from PIL import Image, ImageEnhance
import time
import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
import psutil


class Pipeline3:
    payload = None
    FFDM = ["ORIGINAL", "PRIMARY", ""]
    JWT = None
    logger = None
    SERVER_IP = None
    SERVER_URL = None
    ADMIN_PASS = None
    SSH_PORT = None


    def __init__(self):
        time.sleep(10)
        formater = logging.Formatter('%(asctime)s %(levelname)-8s %(message)s')        
        self.logger = logging.getLogger()
        self.logger.setLevel(logging.INFO)
        handler = RotatingFileHandler("/var/logs/pipeline.log",
                                      backupCount=7)
        handler.setFormatter(formater)
        self.logger.addHandler(handler)
        self.logger.info("LaviDB : FFDM-PIPELINE")
        self.load_payload_template()
        self.load_envs()
        requests.packages.urllib3.disable_warnings(
        requests.packages.urllib3.exceptions.InsecureRequestWarning)
        self.start()
        # schedule.every(60).minutes.do(self.start)
        # while True:
        #     schedule.run_pending()
        #     time.sleep(1)
      
    def start(self):
        self.logger.info("## Pipeline Started ##")
        self.logger.info("Getting JWT...")
        self.get_jwt()
        self.logger.info("[OK!]")
        self.logger.info("Reading silver folder...")
        silver = pathlib.Path("silver")
        files = list(silver.rglob("*.dcm"))
        if files:
            self.logger.info(f"Found {len(files)} files!")
            # for file in files:
            #     self.logger.info(f"Extracting image info...")
            #     request = self.create_payload(file)
            #     self.logger.info(f"Pushing image info to LaviDB Web...")
            #     self.send(json.dumps(request))
            #     self.logger.info(f"[OK!]")
            self.generate_thumb()
            #self.logger.info(f"Moving thumbs and DICOM files to server...")
            self.move_files()
            self.logger.info(f"[OK!]")
        else:
            self.logger.info(f"No files Found!")
        self.logger.info(f"## Pipeline Finished ##")    
        return

    def create_payload(self,file):
        dcm_header = pydicom.filereader.dcmread(file)
        if dcm_header.ImageType == self.FFDM:
            request = copy.copy(json.loads(self.payload))
            request["accessionNumber"] = str(dcm_header.AccessionNumber)
            request["acquisitionDate"] = str(datetime.strptime(dcm_header.AcquisitionDate,"%Y%m%d")).replace(' ','T')+".000Z"
            request["imageLaterality"] = str(dcm_header.ImageLaterality)
            request["viewPosition"] = str(dcm_header.ViewPosition)
            request["imageRaw"] = str(dcm_header.SOPInstanceUID)
            request["imagePath"] = str(file)
            request["thumbPath"] = f"{self.SERVER_URL}/files/{str(dcm_header.SOPInstanceUID)}.png"
            request["manufacturer"]["name"] = str(dcm_header.Manufacturer)
            request["manufacturer"]["model"] = str(dcm_header.ManufacturerModelName)
            request["manufacturer"]["modality"] = str(dcm_header.Modality)
            request["manufacturer"]["hash"] = str(dcm_header.Manufacturer)+str(dcm_header.ManufacturerModelName)
            request["irradiationEvent"]["kvp"] = str(dcm_header.KVP)
            request["irradiationEvent"]["relativeXrayExposure"] = str(dcm_header.RelativeXRayExposure)
            request["irradiationEvent"]["dosemAs"] = str(dcm_header.XRayTubeCurrent)
            request["irradiationEvent"]["dosemGy"] = str(dcm_header.EntranceDoseInmGy)
            request["patient"]["name"] = str(dcm_header.PatientName) 
            request["patient"]["sex"] = str(dcm_header.PatientSex)
            request["patient"]["birthDate"] = str(dcm_header.PatientBirthDate)
            request["patient"]["age"] = str(dcm_header.PatientAge.replace('Y',''))
            request["patient"]["hash"] = str(dcm_header.PatientName)+str(dcm_header.PatientSex)
            request["diagnostic"]["id"] = "2" 
            request["institution"]["name"] = str(dcm_header.InstitutionName)
            request["institution"]["department"] = str(dcm_header.InstitutionalDepartmentName)
            request["institution"]["hash"] = str(dcm_header.InstitutionName)+str(dcm_header.InstitutionalDepartmentName)
            #self.generate_thumb(file,dcm_header.SOPInstanceUID)    
            return request
        return None

    def load_payload_template(self):
        with open('payload.json') as template_file:
            self.payload = template_file.read()
        return

    def get_jwt(self):
        url = f'{self.SERVER_URL}/api/authenticate'
        payload = {"username":"admin", "password":self.ADMIN_PASS}
        request = requests.post(url, json = payload, verify=False)
        self.JWT = request.json()['id_token']
    
    def send(self,payload):
        url = f'{self.SERVER_URL}/api/acquisitions'
        headers = {"Authorization": "Bearer "+self.JWT,
                   "Content-Type": 'application/json'}
        request = requests.post(url, data = payload, headers = headers, verify=False )
        if request.status_code != 201:
            self.logger.info(f"Retrying...")


    
    def generate_thumb(self):
        self.logger.info(f"Generating thumbs...")
        silver = pathlib.Path("silver")
        files = list(silver.rglob("*.dcm"))
        if files:
            for file in files:
                dcm_header = pydicom.filereader.dcmread(file)
                file_name = dcm_header.SOPInstanceUID
                plt.axis("off")
                ds_img = pydicom.dcmread(str(file))
                plt.imshow(ds_img.pixel_array, cmap='gray_r')
                plt.savefig(
                    f"./thumbs/{file_name}.png",
                    bbox_inches="tight",
                    pad_inches=0,
                )
                img = Image.open(f"./thumbs/{file_name}.png").convert("RGB")
                img_bright_enhancer = ImageEnhance.Brightness(img)
                enhanced_bright_output = img_bright_enhancer.enhance(0.06)
                img_contrast_enhancer = ImageEnhance.Contrast(enhanced_bright_output)
                enhanced_output = img_contrast_enhancer.enhance(7.2)
                enhanced_output.save(f"thumbs/{file_name}.png")

    def move_files(self):
        os.system(f'scp -P {self.SSH_PORT} thumbs/* ubuntu@{self.SERVER_IP}:/files/thumbs')
        #os.system('rm thumbs/*')
        #os.system('scp silver/* gregoryzanelato@192.168.1.18:~/files/gold')
        #os.system('mv silver/* gold')

    def load_envs(self):
        load_dotenv()
        self.SERVER_IP = os.getenv('SERVER_IP')
        self.SERVER_URL = os.getenv('SERVER_URL')
        self.ADMIN_PASS = os.getenv('ADMIN_PASS')
        self.SSH_PORT = os.getenv('SSH_PORT')
        
            
    


pipeline3 = Pipeline3()
#pipeline3.start()


