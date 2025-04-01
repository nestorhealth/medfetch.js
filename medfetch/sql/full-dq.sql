-- load
.headers ON
.load ./bin/linux-x86/medfetch

-- query is: Pull data on all patients who underwent surgical treatment for some condition, call it X
-- let patients, procedures, and conditions be the tables, then the desired query is in the form of:

-- Example full data-query for (Condition="laceration of the arm","283371005")
-- in this example, we will use the most recent procedure associated with a 
-- patient who was treated for said Condition

-- SELECT * FROM patients 
-- INNER JOIN procedures ON procedures.patient_id = patients.id 
-- INNER JOIN conditions ON conditions.patient_id = patients.id
-- WHERE conditions.code = X

-- http://hl7.org/fhir/us/core/StructureDefinition/us-core-race
CREATE TABLE IF NOT EXISTS Patient AS SELECT * FROM MEDFETCH('Patient');
CREATE TABLE IF NOT EXISTS Procedure AS SELECT * FROM MEDFETCH('Procedure');
CREATE TABLE IF NOT EXISTS Condition AS SELECT * FROM MEDFETCH('Condition');
CREATE TABLE IF NOT EXISTS Observation AS SELECT * FROM MEDFETCH('Observation');
CREATE TABLE IF NOT EXISTS Encounter AS SELECT * FROM MEDFETCH('Encounter');
CREATE TABLE IF NOT EXISTS ImagingStudy AS SELECT * FROM MEDFETCH('ImagingStudy');
CREATE TABLE IF NOT EXISTS MedicationRequest AS SELECT * FROM MEDFETCH('MedicationRequest');
CREATE TABLE IF NOT EXISTS Claim AS SELECT * FROM MEDFETCH('Claim');

/*
    DESIRED RESULT SET:
    | 
*/

DROP TABLE IF EXISTS conditions_aux;
CREATE TABLE conditions_aux AS
SELECT
    Condition.id AS id,
    Code.value ->> 'code' AS condition_code,
    Code.value ->> 'display' AS code_display,
    Condition.json -> 'subject' ->> 'reference' AS patient_id
FROM
    Condition,
    json_each(Condition.json, '$.code.coding') AS Code
WHERE
    Condition.json -> 'subject' ->> 'reference' LIKE 'Patient/%';

DROP TABLE IF EXISTS procedures_aux;
CREATE TABLE procedures_aux AS
SELECT
    Procedure.id AS id,
    Procedure.json -> 'subject' ->> 'reference' AS patient_id,
    Procedure.json -> 'encounter' ->> 'reference' AS encounter_id,
    Code.value ->> 'code' AS procedure_code,
    Code.value ->> 'display' AS code_display,
    Procedure.json -> 'performedPeriod' ->> 'end' AS procedure_end_time,
    Procedure.json -> 'reasonReference' -> 0 ->> 'reference' AS condition_reason_ref,
    Procedure.json -> 'reasonReference' -> 0 ->> 'display' AS condition_reason_display
FROM
    Procedure,
    json_each(Procedure.json, '$.code.coding') AS Code
WHERE
    Procedure.json -> 'subject' ->> 'reference' LIKE 'Patient/%';

-- cleaned Observation's table
DROP TABLE IF EXISTS observations_aux;
CREATE TABLE observations_aux AS
SELECT
    Observation.id AS id,
    Code.value ->> 'code' AS observation_code,
    Code.value ->> 'display' AS code_display,
    Observation.json -> 'subject' ->> 'reference' AS patient_id,
    ValueCode.value ->> 'code' AS value_code,
    ValueCode.value ->> 'display' AS value_code_display,
    Observation.json -> 'effectiveDateTime' AS recorded_date
FROM
    Observation,
    json_each(Observation.json, '$.code.coding') AS Code,
    json_each(Observation.json, '$.valueCodeableConcept.coding') AS ValueCode
WHERE
    Observation.json -> 'subject' ->> 'reference' LIKE 'Patient/%'
    AND ValueCode.value ->> 'system' = 'http://snomed.info/sct';

DROP TABLE IF EXISTS encounters_aux;
CREATE TABLE encounters_aux AS
SELECT
    id,
    Encounter.json -> 'subject' ->> 'reference' AS patient_id,
    ROUND((julianday(Encounter.json -> 'period' ->> 'end') - 
           julianday(Encounter.json -> 'period' ->> 'start')) * 24, 2) AS duration_hours
FROM Encounter;

DROP TABLE IF EXISTS imagingstudy_aux;
CREATE TABLE imagingstudy_aux AS
SELECT
    ImagingStudy.id                                  AS id,
    ImagingStudy.json -> 'subject' ->> 'reference'   AS patient_ref,
    ImagingStudy.json -> 'encounter' ->> 'reference' AS encounter_ref,
    ImagingStudy.json -> 'series'                    AS series
FROM ImagingStudy;

DROP TABLE IF EXISTS medicationrequests_aux;
CREATE TABLE medicationrequests_aux AS
SELECT
    MedicationRequest.id,
    MedicationRequest.json -> 'subject' ->> 'reference' AS patient_ref,
    MedicationRequest.json -> 'encounter' ->> 'reference' AS encounter_ref
FROM MedicationRequest;
    
DROP TABLE IF EXISTS result;

CREATE TABLE result AS
WITH latest_procedure AS (
    SELECT
        procedures_aux.patient_id,
        MAX(procedure_end_time) AS max_end_time
    FROM procedures_aux
    INNER JOIN conditions_aux ON 'Condition/' || conditions_aux.id = procedures_aux.condition_reason_ref
    WHERE conditions_aux.condition_code = '283371005'
    GROUP BY procedures_aux.patient_id
)
SELECT DISTINCT
    Patient.id AS id, -- id
    CAST((julianday('now') - julianday(Patient.json->>'birthDate')) / 365.25 AS INTEGER) AS age, -- age
    Patient.json -> 'gender' AS gender, -- gender
    race_ext.value -> 'valueCoding' ->> 'display' AS race, -- race

    -- the following 3 would be found on the same Observation row
    -- most likely
    observations_aux.value_code_display AS smoking_status, -- REPLACE gestational_age
    observations_aux.value_code AS smoking_status_code, -- REPLACE birth_weight
    observations_aux.recorded_date AS smoking_status_obs_date, -- REPLACE apgar

    encounters_aux.duration_hours AS er_stay_duration, -- REPLACE days_in_nicu
    imagingstudy_aux.series AS image -- image
FROM 
    Patient,
    json_each(Patient.json -> 'extension') AS ext,
    json_each(ext.value -> 'extension') AS race_ext
INNER JOIN observations_aux ON 'Patient/' || Patient.id = observations_aux.patient_id
INNER JOIN latest_procedure ON 'Patient/' || Patient.id = latest_procedure.patient_id
INNER JOIN procedures_aux ON 
    procedures_aux.patient_id = latest_procedure.patient_id 
    AND procedures_aux.procedure_end_time = latest_procedure.max_end_time
INNER JOIN conditions_aux ON 'Patient/' || Patient.id = conditions_aux.patient_id
INNER JOIN encounters_aux ON 'Encounter/' || encounters_aux.id = procedures_aux.encounter_id
LEFT JOIN imagingstudy_aux ON 'Encounter/' || encounters_aux.id = imagingstudy_aux.encounter_ref -- LEFT JOIN since we can't find any imagingstudies
INNER JOIN medicationrequest
WHERE
    ext.value ->> 'url' = 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race'
    AND race_ext.value ->> 'url' = 'ombCategory'
    AND observations_aux.observation_code = '72166-2'
    AND conditions_aux.condition_code = '283371005';
