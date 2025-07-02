const mockPatientBundle = {
  resourceType: "Bundle",
  type: "collection",
  entry: [
    {
      fullUrl: "urn:uuid:patient-1",
      resource: {
        resourceType: "Patient",
        id: "patient-1",
        name: [
          {
            use: "official",
            family: "Doe",
            given: ["John"]
          }
        ],
        gender: "male",
        birthDate: "1980-01-01"
      }
    },
    {
      fullUrl: "urn:uuid:patient-2",
      resource: {
        resourceType: "Patient",
        id: "patient-2",
        name: [
          {
            use: "official",
            family: "Smith",
            given: ["Jane"]
          }
        ],
        gender: "female",
        birthDate: "1990-05-12"
      }
    }
  ]
};

const jsonBlob = new Blob([JSON.stringify(mockPatientBundle, null, 2)], {
  type: "application/json"
});

export const mockPatientBundleFile = new File(
  [jsonBlob],
  "mock-patient-bundle.json",
  {
    type: "application/json"
  }
);
