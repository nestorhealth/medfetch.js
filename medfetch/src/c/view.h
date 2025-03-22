#ifndef VIEW_H
#define VIEW_H

struct sqlite3;
struct sqlite3_stmt;

int on_create_view(unsigned int event, void *db, 
                   void *stmt, void *arg3);

#endif