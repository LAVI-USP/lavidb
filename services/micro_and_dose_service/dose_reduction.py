import numpy as np
from scipy.ndimage import convolve
import pydicom
from scipy.io import loadmat


def dose_reduction(file, reduced_dose, kernel, a_o, offset, sigma_elec):
    """
    This function generates simulated low dose DBT projections and FFDM from a standard dose image.

    Published: L.R. Borges; I. Guerrero; P.R. Bakic; A. Foi; A.D.A. Maidment; M.A.C. Vieira.
    "Method for Simulating Dose Reduction in Digital Breast Tomosynthesis".
    IEEE Transactions on Medical Imaging, v.36, p.2331-2342, 2017.

    Inputs:
    Im_orig - Original image with standard dose (RAW DBT projection or RAW FFDM)
    kernel - Convolutional kernel (spatial domain) describing noise correlation
    a_o - Gain of the quantum noise
    Reduc - Reduction rate (e.g. 0.5 for 50% dose reduction)
    Offset - Detector offset (e.g. ~50 for Hologic DBT systems)
    Sigma_elec - Standard deviation of the electronic noise (e.g. ~3 for Hologic systems)

    THIS WORK SHOULD ONLY BE USED FOR NON-PROFIT PURPOSES!
    """

    Im_orig = pydicom.dcmread(file).pixel_array

    # Image Size
    M, N = Im_orig.shape

    # Linearization
    Im_origL = Im_orig - offset

    # Calculate Parameters of the Operator
    a = a_o / reduced_dose
    sigma = np.sqrt(-1 + 1 / reduced_dose)
    c_1 = sigma**2 / (a - a_o)
    c_2 = -(sigma**2) / 8
    
    # Noise_Mask = convolve(
    #     sigma * np.random.randn(M, N), kernel[::-1, ::-1], mode="wrap"
    # )

    # mdic = { "noise_mask" : Noise_Mask}
    # savemat(f"{reduced_dose}_dose.mat", mdict=mdic)

    Noise_Mask = loadmat(f"noise_estimation/{reduced_dose}_dose.mat")["noise_mask"]

    # Noise Injection
    Im_sim = (
        reduced_dose
        * (
            (2 * np.sqrt(np.maximum(0, c_1 * Im_origL + c_2)) + Noise_Mask) ** 2 / 4
            - c_2
            - sigma**2 / 4
        )
        / c_1
    )
    Im_sim = ((1 - reduced_dose) * sigma_elec * np.random.randn(M, N)) + offset + Im_sim

    return Im_sim
