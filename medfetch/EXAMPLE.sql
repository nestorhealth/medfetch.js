-- on load call, prompt login for auth
.load ./medfetch

-- then make each fetch request
-- if auth token wasn't provided (because the user failed to login)
-- or it is expired, then rerequest said token on the next virtual table call
CREATE VIRTUAL TABLE Patient USING MEDFETCH;

-- the columns is the union of the keys fetched
CREATE VIRTUAL TABLE Condition USING MEDFETCH;

-- 'materialize' tables to persist them!
SELECT * FROM Patient;
SELECT * FROM Condition;

-- can even derive more specific tables from medfetch virtual tables
-- using CTAS (CREATE TABLE AS SELECT)
CREATE TABLE patients_simple AS
SELECT Patient.id, Patient.name FROM Patient;

