import { sql2 } from "@/lib/sqlite-wasm";

const name = (as = "name") => `
  (json -> 'name' -> 0 -> 'given' ->> 0) 
  || ' '
  || (json -> 'name' -> 0 ->> 'family') as ${as}
`;

const patient_migration = sql2`
  create table if not exists patient (
    id text primary key,
    birth_date text,
    gender text,
    name text,
    is_deceased text,
    mrn text
  );
  
  create table if not exists patients_json 
  as
    select
      id,
      json ->> 'birthDate' as birth_date,
      json ->> 'gender' as gender,
      ${name()},
      identifier.value ->> 'value'
    from
      medfetch('Patient') as p,
      json_each(p.json -> 'identifier');
`;
