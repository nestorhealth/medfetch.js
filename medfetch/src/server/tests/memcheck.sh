#!/bin/bash
valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes sqlite3 :memory: < scripts/mem.sql > results/mem2.txt 2>&1
