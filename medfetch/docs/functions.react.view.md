# view
The `view` function allows you to define arbitrary React state derived
from a [Dialect](https://kysely.dev/docs/dialects) and a provided
`read` callback function.

```tsx
"use client";

import type { Patient } from "fhir/r5";
import { view } from "medfetch/react";
import medfetch from "medfetch/sqlite-wasm"

export default function Page() {
    const dialect = medfetch("https://localhost:8787/fhir")
    const patientsView = view<{ Patient: Patient }>(dialect)(
        async db => db
            .selectFrom("Patient")
            .selectAll("Patient")
            .execute()
            .then(patients => patients.map(p => ({ ...p, name: JSON.parse(p.name) })))
    );
    if (!patientsView.data) {
        return <p>Loading...</p>
    }
    
    return (
        <main>
            {patientsView.data.map(
                (patient) => (
                    <div key={patient.id}>
                        <p>First name: {patient.name[0].given}</p>
                    </div>
                )
            )}
        </main>
    );
}
```

You can define a mutation callback that can optionally set the new View state:

```tsx
"use client";

import type { Patient, HumanName } from "fhir/r5";
import { view } from "medfetch/react";
import medfetch from "medfetch/sqlite-wasm"
import { useState } from "react";

export default function Page() {
    const dialect = medfetch("https://localhost:8787/fhir")
    const patientsView = view<{ Patient: Patient }>(dialect)(
        async db => db
            .selectFrom("Patient")
            .selectAll("Patient")
            .execute()
            .then(patients => patients.map(p => ({ ...p, name: JSON.parse(p.name) }))),
        // Pass in a function that takes in 2 args
        (db, set) =>
            // Return the mutation function (can be async)
            async (id: string, previousName: HumanName[], newFirstName: string) => {
                await db.updateTable("Patient").set({
                    name: [
                        {
                            ...previousName[0],
                            given: newFirstName
                        },
                        ...previousName
                    ]
                })
                .where("Patient.id", "=", id)
                .execute();
            }
    );
    
    if (!patientsView.data) {
        return <p>Loading...</p>
    }
    
    return (
        <main>
            {patientsView.data.map(
                (patient) => {
                    const [patientName, setPatientName] = 
                        useState(patient.name[0].given);
                    return (
                        <div key={patient.id}>
                            <p>First name: 
                                <input 
                                    value={patient.id}
                                    onChange={e => 
                                        setPatientName(e.currentTarget.value)}
                                >
                                    {patientName}
                                </input>
                                <button onClick={patientsView.mutate}>
                                    Save new name
                                </button>
                            </p>
                        </div>
                    )
                }             
            )}
        </main>
    );
}
```