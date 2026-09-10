/**
 * Phase 12 Google Drive structure created under digital@espoparis.com.
 * Folder IDs are identifiers, not secrets. They are centralized here so a future
 * Drive adapter can be configured without scattering IDs across UI code.
 */
export const googleDriveFolders = {
  root: "1xnH3tcSMruYXEEoqeL2yKSf96WppbD5T",
  library: {
    root: "18WHG7h0wH4GEMyhfhE507r19lnoiIv3f",
    books: "1SvUs5GA91RweQkJACbZhe5oIX0r0cczh",
    covers: "1pWWG3AI0NpnPyROc5TCSONTN59flIZGc",
    catalog: "1b83CAF_lcV8YrPUFpBKfiyjJ3QfJFQFF",
    intake: "1_mKhZLg_ZRri40-5KqkSDDjEjwjZb_Kl",
    archive: "1C1x33E7mysffiBHZZ6hHz3or_jqV-5kw",
  },
  learning: {
    root: "1pnSmZsoIfdvOZ-NTcOnbhRMOwhevkjCR",
    academicYear2026_2027: "1jGCXvde3i2g1s6SRNswNFh4MnbYcmxWJ",
    year1: "1xisYHe1J_ubxD1lBFJsslqBtiBelPNIQ",
    semester1: "1EN5cncfSbdXokOgTw4YCgup6VaMzZac2",
    semester2: "1ehK0UV6XGPsq-3PSBP8zjQQPYExPdqtR",
    year2: "1_VZC4m3Y1WcUeaWyOIZjncgn_Fq3uqL1",
    semester3: "1ylL_ExqnLEh1SLjPvfsy02qcapwzYZRe",
    semester4: "1H-lc_ibm_VMwfMXGOz4ehe8gCaep-oPo",
    year3: "1rYV1WWpuQCL8HB54qvRAxSWOuF-DEIsG",
    semester5: "1cfhoQ1cPMKvbC46a4HrIk26WMsEg6E4U",
    semester6: "1jCbzc8lkY0bkXzsPPfziYNlptivAw7B3",
    year4: "1_BDKB3I72vOoIxE4IA2Bj87Ay4hQ0iBX",
    semester7: "1cxhsCYujpQfuMHytrBqPC0jEmSt-Anse",
    semester8: "1AT71ejPSbkoTg3QGfnpnr1PYPL4JpyOc",
    teacherUploads: "10eKKU9SmF0slXBE4p_lMqtAVdjGniOb5",
    sharedResources: "1xPsdvEafefdQZvMTjd77X6F9MS7KHySR",
    archive: "1HY48oeUwK9H1gbQ5OjbaVxbCDteDIOV_",
  },
  operations: {
    root: "1s7PCf5a4rt_atiP8UrHOBRXuY607Y9eD",
    accessEntitlements: "1u8ufn8lw-NwbA0eWvw5K-aLSWNSiIkmH",
    contentReview: "1p3WcIiX7aNpnNfEMpindc7zenBriUXgJ",
    backups: "1eCK3SsUG-nlJojg2Cbn-T1AN_Sb2FRL7",
  },
} as const;
