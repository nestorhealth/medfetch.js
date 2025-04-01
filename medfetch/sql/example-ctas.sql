.load ./src/server/build/linux/x86_64/medfetch
-- Begin CTAS
CREATE TABLE patients AS
SELECT
    json_extract(json, '$.id') AS id,
    json_extract(json, '$.gender') as gender,
    json_extract(json, '$.birthDate') as birthDate,
    json_extract(json, '$.name') as name
FROM medfetch('Patient');
