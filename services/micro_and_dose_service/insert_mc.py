#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pydicom
import numpy as np
import cv2
from scipy.io import loadmat
import random
from scipy import signal
import matplotlib.pyplot as plt
import pathlib
import utils
from dose_reduction import dose_reduction


def create_cluster(path_individual_calcs, min_lesion, max_lesion, microns_lesion):
    # Number of microcalcification
    N = random.choice(range(min_lesion, max_lesion + 1))
    X, Y = generate_positions(N)

    # Mudar para 100,100
    ROI = np.zeros((100, 100))
    contrasts = [1] + random.sample(np.linspace(0.5, 1, 100).tolist(), N - 1)
    micros_path = pathlib.Path(f"{path_individual_calcs}")
    files = list(micros_path.rglob("*.png"))
    calcs = random.choices(files, k=N)
    for k in range(N):
        Calc = plt.imread(str(calcs[k]))
        Calc = contrasts[k] * Calc[:, :, 0] / np.max(Calc[:, :, 0])
        ROI[int(X[k] - 5) : int(X[k] + 2), int(Y[k] - 5) : int(Y[k]) + 2] += Calc
    return ROI


def generate_positions(n):
    # Parameters
    W = 25  # Size of the microcalc window
    xtr = np.arange(0, 101)  # Dimensions (transition)
    diffxtr = np.diff(xtr)
    D = np.concatenate(
        ([diffxtr[0]], np.minimum(diffxtr[:-1], diffxtr[1:]), [diffxtr[-1]])
    )

    PDFMicrocalc = 1 - signal.gaussian(W, std=10)
    out = np.zeros(PDFMicrocalc.shape, np.double)
    PDFMicrocalc = cv2.normalize(
        PDFMicrocalc, out, 0.0, 1.0, cv2.NORM_MINMAX, dtype=cv2.CV_32F
    )
    kernel_pdf_mae = signal.gaussian(100, std=20)
    PDFMae = np.zeros((100, 100, n))
    kernel_2d = np.outer(kernel_pdf_mae, kernel_pdf_mae)
    for rls in range(n):
        PDFMae[:, :, rls] = kernel_2d

    X = np.zeros(n)
    Y = np.zeros(n)

    for rls in range(n):
        # Round 1 - X
        PDF = np.sum(PDFMae[:, :, rls], axis=0)
        PDF /= np.sum(PDF)
        CDFP = np.cumsum(PDF)

        randu = np.random.rand(1)
        idx = min(
            np.sum(np.tile(randu, (1, CDFP.shape[0])) >= np.tile(CDFP, (1, 1)), axis=1)[
                0
            ]
            + 1,
            len(xtr),
        )
        zout = xtr[idx]
        randu = np.random.rand(1) - 0.5
        randu += np.random.rand(1) - 0.5
        zout = np.dot(randu, D[idx]) + zout

        X[rls] = round(min(max(zout[0], 1 + W / 2), 100 - W / 2))

        # Round 2 - Y
        PDF = PDFMae[:, int(round(X[rls])), rls]
        PDF /= np.sum(PDF)
        CDFP = np.cumsum(PDF)

        randu = np.random.rand(1)
        idx = min(
            np.sum(np.tile(randu, (1, CDFP.shape[0])) >= np.tile(CDFP, (1, 1)), axis=1)[
                0
            ]
            + 1,
            len(xtr),
        )
        zout = xtr[idx]
        randu = np.random.rand(1) - 0.5
        randu += np.random.rand(1) - 0.5
        zout = np.dot(randu, D[idx]) + zout

        Y[rls] = round(min(max(zout[0], 1 + W / 2), 100 - W / 2))

        # Update MotherPDF
        temp = PDFMae[:, :, rls]
        temp[
            int(X[rls] - W / 2) : int(X[rls] + W / 2),
            int(Y[rls] - W / 2) : int(Y[rls] + W / 2),
        ] *= PDFMicrocalc
        PDFMae[:, :, rls] = temp / np.sum(temp)

    return X, Y


def insertMC(
    file,
    file_name,
    min_lesion,
    max_lesion,
    microns_lesion,
    array_contrast,
    result_path,
    logger,
    additional_dose,
    dose_list,
    kernel,
    a_o,
    offset,
    sigma_elec,
):

    dcmHdr = pydicom.dcmread(file)

    # INSERT MC
    img_num = file.split("/")[1].split(".")[0]
    dcmData = pydicom.dcmread(file).pixel_array.astype(np.float32)

    resLoad = loadmat(f"density_estimation/Masks_{img_num}.mat")[
        "res"
    ]  # Loads the density and breast masks
    res = dict()
    for dtype, value in zip(resLoad[0][0].dtype.names, resLoad[0][0]):
        res[dtype] = value
    del resLoad

    # NOTE: The density and breast masks were used to facilitate the automated
    # insertion of MCs. The masks were obtained using the open-souce algorithm
    # LIBRA, available for download at:
    # https://www.med.upenn.edu/sbia/libra.html

    # Create MC clusters
    logger.info(f"creating cluster with {min_lesion} to {max_lesion} lesions..")
    maskMC = create_cluster(
        path_individual_calcs="lesions",
        min_lesion=min_lesion,
        max_lesion=max_lesion,
        microns_lesion=microns_lesion,
    )
    logger.info(f"OK!")
    withot_micros = True

    res["BreastMask"][:, -1] = 0
    res["BreastMask"][:, 0] = 0

    element = cv2.getStructuringElement(
        shape=cv2.MORPH_ELLIPSE, ksize=(maskMC.shape[0] // 2, maskMC.shape[0] // 2)
    )
    erodedMask = cv2.erode(res["BreastMask"], element)

    # Removes isolated pixels
    element1 = cv2.getStructuringElement(cv2.MORPH_RECT, (6, 6))
    element2 = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    mask = cv2.morphologyEx(res["DenseMask"], cv2.MORPH_CLOSE, element1)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, element2)
    cleanDensity = res["DenseMask"] * mask

    # Map of possible positions
    possiblePoints = erodedMask * cleanDensity

    image_center = tuple(
        (int(np.floor(maskMC.shape[0] // 2)), int(np.ceil(maskMC.shape[1] // 2)))
    )
    coverage_pct = 0.92  # 92% of ones (dense area) found in ROI
    check_points_1 = False
    roi_size = maskMC.shape[0] ** 2
    lowCoord = 0
    upCoord = 0
    coords = 0
    while not check_points_1:
        # Ramdomly selects one of the possible points
        i, j = np.where(possiblePoints == 1)
        randInt = np.random.randint(0, i.shape[0])
        coords = (i[randInt], j[randInt])
        lowCoord = np.array(coords) - np.array(image_center)
        upCoord = np.array(coords) + np.array(image_center)
        roi_possible = possiblePoints[
            lowCoord[0] : upCoord[0], lowCoord[1] : upCoord[1]
        ]
        ones = np.count_nonzero(roi_possible == 1)
        check_points_1 = ones >= (roi_size * coverage_pct)

    for contrast in array_contrast:
        logger.info(f"inserting cluster with {contrast} of contrast...")
        maskN = maskMC.copy()
        maskN[maskMC != 0] = maskN[maskMC != 0] * contrast
        maskN = np.abs(maskN - 1)
        inserted = np.empty(dcmData.shape, dtype=dcmData.dtype)
        inserted[:] = dcmData.copy()

        inserted[lowCoord[0] : upCoord[0], lowCoord[1] : upCoord[1]] *= maskN
        file_with_lesion = (
            f"{result_path}/{file_name}_full_dose_with_lesion_mc_{min_lesion}_{max_lesion}_contrast_{contrast}.dcm"
        )
        utils.writeDecompressedDicomLibra(
            dcmFileName=file_with_lesion, dcmImg=inserted, dcmHdr=dcmHdr, file_name=file_name,
        )
        if additional_dose:
            for i in range(len(dose_list)):
                # REDUC DOSE WITHOT MICROS
                reduced_dose = int(dose_list[i]["doseReduced"]) / 100
                if withot_micros:
                    logger.info(
                        f"reducing dose by {int(reduced_dose*100)}% without lesions..."
                    )
                    reduced_with_lesion = dose_reduction(
                        file=file,
                        reduced_dose=reduced_dose,
                        kernel=kernel,
                        a_o=a_o,
                        offset=offset,
                        sigma_elec=sigma_elec,
                    )
                    file_reduced = f"{result_path}/{file_name}_{str(int(reduced_dose*100))}_dose_no_lesion.dcm"
                    utils.writeDecompressedDicomLibra(
                        dcmFileName=file_reduced,
                        dcmImg=reduced_with_lesion,
                        dcmHdr=dcmHdr,
                        file_name=file_name,
                    )
                # REDUC DOSE WITH MICROS
                logger.info(
                    f"reducing dose by {int(reduced_dose*100)}% with lesions..."
                )
                reduced_with_lesion = dose_reduction(
                    file=file_with_lesion,
                    reduced_dose=reduced_dose,
                    kernel=kernel,
                    a_o=a_o,
                    offset=offset,
                    sigma_elec=sigma_elec,
                )
                file_reduced = f"{result_path}/{file_name}_{str(int(reduced_dose*100))}_dose_with_lesion_mc_{min_lesion}_{max_lesion}_contrast_{contrast}.dcm"
                utils.writeDecompressedDicomLibra(
                    dcmFileName=file_reduced,
                    dcmImg=reduced_with_lesion,
                    dcmHdr=dcmHdr,
                    file_name=file_name,
                )
            withot_micros = False
    return f"[{lowCoord[0]} : {upCoord[0]}, {lowCoord[1]} : {upCoord[1]}]"