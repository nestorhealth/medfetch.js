# SQL on FHIR
We've mentioned the word "SQL on FHIR" often throughout here, but haven't properly defined it yet.
Fast Healthcare Interoperability Resources, or `FHIR` for short, is an API specification for exchanging
clinical data on the web. While there's a lot to FHIR, it's helpful to think of FHIR resources 
as a bunch of `abstract class` / `interface` declarations from Java, and FHIR servers being the `main` server 
loop that uses their own **implementations** of these interfaces to run an API.

[`SQL on FHIR`](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/index.html) officially is a specification outlining a standard
for sending data from a FHIR server to a SQL like database. There is no "official" implementation, though there are numerous
existing ones.

- TODO

SQL on FHIR outlines a [View Defininition](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html) extension
Resource that encodes how to transform FHIR JSON objects into row-like objects that can (better) be inserted into an SQL database.

Medfetch is **NOT** a `View Definition` implementation, it does *NOT* use any FHIRPath. It eagerly takes the immediate
