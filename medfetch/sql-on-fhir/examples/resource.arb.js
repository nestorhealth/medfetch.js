import { Schema } from "effect";
import { Resource } from "./data.schema";

export const narrow_resource_cases = [
    {
        title: "Minimal valid Patient resource",
        input: {
            resourceType: 'Patient',
            id: 'test-patient-1',
            name: [{ family: 'Doe', given: ['John'] }],
            gender: 'male',
            birthDate: '1980-01-01'
        },
        schema: Resource('Patient'),
        expected: true
    }
];

export const wide_resource_cases = [
    {
        title: "Complex Patient resource with additional fields",
        input: {
            resourceType: 'Patient',
            id: 'test-patient-2',
            name: [
                {
                    use: 'official',
                    family: 'Smith',
                    given: ['Jane', 'Marie'],
                    prefix: ['Dr.'],
                    suffix: ['MD']
                }
            ],
            gender: 'female',
            birthDate: '1975-06-15',
            address: [
                {
                    use: 'home',
                    type: 'physical',
                    line: ['123 Main St', 'Apt 4B'],
                    city: 'Boston',
                    state: 'MA',
                    postalCode: '02108',
                    country: 'USA'
                }
            ],
            telecom: [
                { system: 'phone', value: '555-123-4567', use: 'home' },
                { system: 'email', value: 'jane.smith@example.com', use: 'work' }
            ],
            communication: [
                {
                    language: {
                        coding: [
                            { system: 'urn:ietf:bcp:47', code: 'en', display: 'English' }
                        ],
                        text: 'English'
                    },
                    preferred: true
                }
            ]
        },
        expected: true
    }
]; 
