#include <stdio.h>
#include <cfhir.h>

int main() {
    printf("ok!\n");
    int x;
    char xstr[] = "3";
    parse_int(xstr, &x);
    printf("%d\n", x);
    return 0;
}
