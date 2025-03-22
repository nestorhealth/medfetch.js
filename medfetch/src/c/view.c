#include "view.h"
#include <stdio.h>

/// SQLite3 [trace hook](https://www.sqlite.org/c3ref/trace_v2.html) function
///
/// Intercept a `CREATE VIEW` statement
/// to insert a "view_definition" row that translates the 
/// SQL statement into a [ViewDefinition](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html)
/// assuming there are 0 joins.
/// @param event - the SQLite trace event
/// @param db - the database pointer
/// @param stmt - the statement pointer
/// @param arg3 - idk
/// @return ignored error code, but still is explicit on errors for readability.
int on_create_view(unsigned int event, void *db, 
                   void *stmt, void *arg3) {
    return 0;
}