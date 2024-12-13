from dose_reduction import dose_reduction
import pydicom
import utils
from insert_mc import insertMC
import pathlib
import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
import requests
import smtplib
import ssl
from scipy.io import loadmat
import pandas as pd
import uuid


JWT = None
logger = None
SERVER_IP = None
SERVER_URL = None
ADMIN_PASS = None
SSH_PORT = None


def simulate_images(payload, logger):
    logger.info("Preparing images simulation...")
    load_dotenv()
    Kernel_GE_Pristina = loadmat(
        "noise_estimation/Kernel_GE_Pristina_FOI_Code.mat"
    )  # Loads pre-calculated kernel (GE Senographe Pristina)
    Parameters_GE_FFDM = loadmat(
        "noise_estimation/Parameters_GE_FFDM_Quadratic.mat"
    )  # Loads parameters noise estimation (GE Senographe Pristina)
    kernel = Kernel_GE_Pristina["Ke"]
    a_o = Parameters_GE_FFDM["Lambda_e"]
    offset = Parameters_GE_FFDM["Tau"]
    sigma_elec = Parameters_GE_FFDM["Sigma_E"]

    parameters = json.loads(payload["parameters"])
    logger.info(f"parameters => {str(payload)}")
    has_lesion = parameters["hasLesion"]
    additional_dose = parameters["hasDose"]
    dose_list = parameters["doseList"]
    logger.info("Creating user output folder...")
    user_id = payload["customUser"]["id"]
    # date_now = datetime.now()
    # request_date = date_now.strftime("%Y%m%d%H%M%S")
    request_date = uuid.uuid4()
    result_path = f"result/user_{user_id}/{request_date}"
    os.system(f"mkdir -p {result_path}")

    silver = pathlib.Path("gold")
    files = list(silver.rglob("*.dcm"))
    if has_lesion:
        columns = ['File Name','Lesion Coordinates']
        coords_data = []
        array_contrast = []
        for i in range(len(parameters["contrastList"])):
            array_contrast.append(int(parameters["contrastList"][i]["contrast"]) / 100)
        min_lesion = parameters["minLesion"]
        max_lesion = parameters["maxLesion"]
        if files:
            logger.info(f"Found {len(files)} files!")
            for file in files:
                file = str(file)
                file_name = file.split("/")[1].split(".")[0]
                logger.info(f"# Processing file {file_name}.dcm  ...")
                microns_lesion = "100-350"
                logger.info(
                    f"adjusting contrast for {array_contrast}"
                )
                coords = insertMC(
                    file=file,
                    file_name=file_name,
                    min_lesion=min_lesion,
                    max_lesion=max_lesion,
                    microns_lesion=microns_lesion,
                    array_contrast=array_contrast,
                    result_path=result_path,
                    logger=logger,
                    additional_dose=additional_dose,
                    dose_list=dose_list,
                    kernel=kernel,
                    a_o=a_o,
                    offset=offset,
                    sigma_elec=sigma_elec,
                )
                logger.info(f"OK!")
                os.system(f"cp {file} {result_path}/{file_name}_full_dose_no_lesion.dcm")
                coords_data.append([int(file_name),coords])
            df = pd.DataFrame(coords_data, columns=columns)
            df = df.sort_values(by=['File Name'])
            df.to_excel("lesion_coordinates.xlsx", sheet_name='Lesion Info', index=False)  
            os.system(f"cp lesion_coordinates.xlsx {result_path}/")
            logger.info(f"# {file_name}.dcm processed OK!")
    else:
        if additional_dose:
            if files:
                logger.info(f"Found {len(files)} files!")
                for file in files:
                    file = str(file)
                    file_name = file.split("/")[1].split(".")[0]
                    dcmHdr = pydicom.dcmread(file)
                    logger.info(f"# Processing file {file_name}.dcm  ...")

                    for i in range(len(parameters["doseList"])):
                        # REDUC DOSE WITHOUT MICROS
                        reduced_dose = (
                            int(parameters["doseList"][i]["doseReduced"]) / 100
                        )
                        logger.info(f"reducing dose by {int(reduced_dose*100)}% ...")
                        reduced_without_lesion = dose_reduction(
                            file=file,
                            reduced_dose=reduced_dose,
                            kernel=kernel,
                            a_o=a_o,
                            offset=offset,
                            sigma_elec=sigma_elec,
                        )
                        logger.info(f"OK!")
                        file_without_lesion = f"{result_path}/{file_name}_{str(int(reduced_dose*100))}_dose_no_lesion.dcm"
                        logger.info(f"generating DICOM...")
                        utils.writeDecompressedDicomLibra(
                            dcmFileName=file_without_lesion,
                            dcmImg=reduced_without_lesion,
                            dcmHdr=dcmHdr,
                            file_name=file_name,
                        )
                        logger.info(f"OK!")
                    logger.info(f"# {file_name}.dcm processed OK!")
                    os.system(f"cp {file} {result_path}/{file_name}_full_dose_no_lesion.dcm")
        else:
            os.system(f"cp gold/* {result_path}")

    file_name = f"{user_id}_{request_date}"
    os.system(f"cd {result_path} && tar -I pigz -cf {file_name}.tar.gz *")
    os.system(f"mv {result_path}/{file_name}.tar.gz thumbs/")
    os.system(f"rm -rf  {result_path}/*")
    logger.info(f"Creating download link and sending e-mail...")
    try:
        create_download_link(
            payload=payload, file_name=file_name, user_id=user_id, request_tag=file_name
        )
    except Exception as e:    
        logger.error(e)
    logger.info(f"Removing generated files...")
    os.system(f"rm -rf  {result_path}/*")
    logger.info(f"Simulation executed successfuly")
    logger.info(f"===============================")


def create_download_link(payload, file_name, user_id, request_tag):
    SERVER_URL = os.getenv("SERVER_URL")
    ADMIN_PASS = os.getenv("ADMIN_PASS")

    url = f"{SERVER_URL}/api/authenticate"
    auth_payload = {"username": "admin", "password": ADMIN_PASS}
    request = requests.post(url, json=auth_payload)
    JWT = request.json()["id_token"]

    # creating link to download
    url = f'{SERVER_URL}/api/database-requests/{payload["id"]}'
    headers = {"Authorization": "Bearer " + JWT, "Content-Type": "application/json"}
    download_link = f"{SERVER_URL}/files/{file_name}.tar.gz"
    payload["downloadLink"] = download_link
    request = requests.put(url, data=json.dumps(payload), headers=headers)

    # getiing user email
    url = f"{SERVER_URL}/api/custom-users/{user_id}"
    headers = {"Authorization": "Bearer " + JWT, "Content-Type": "application/json"}
    request = requests.get(url, headers=headers)
    user = request.json()

    # sending mail
    send_mail(user["email"], download_link, request_tag)

def send_mail(to, link, request_tag):
    MAIL_PASS = os.getenv("MAIL_PASS")
    date_now = datetime.now()
    expiration_date = date_now + timedelta(days=7)
    expiration_date = expiration_date.strftime("%m/%d/%Y")
    port = 587  # For starttls
    smtp_server = "smtp.gmail.com"
    sender_email = "lavidb.usp@gmail.com"
    receiver_email = to
    password = MAIL_PASS
    subject = f"LAVIDB - Custom database request #{request_tag}"
    text = f"""\
    Your database is ready to download at: {link}
    This link will expire on: {expiration_date}.

    Thanks for using LAVIDB!
    """
    message = "Subject: {}\n\n{}".format(subject, text)
    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        server.ehlo()  # Can be omitted
        server.starttls(context=context)
        server.ehlo()  # Can be omitted
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)
