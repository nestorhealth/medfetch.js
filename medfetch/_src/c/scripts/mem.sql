.load ./build/x86_64/fetch

INSERT INTO fhir VALUES ('r4', 'https://r4.smarthealthit.org/');
CREATE VIRTUAL TABLE Patient USING FETCH('r4', 'Patient', 230);

SELECT * FROM Patient;

CREATE TABLE patients AS
SELECT
    row ->> 'id' AS id
FROM Patient;

.quit