# c on fhir

Convenience functions over [libcurl](https://curl.se/libcurl/c/) and [jansson](https://jansson.readthedocs.io/en/latest/) for making HTTP REST calls.

This code is meant for the very specific use case of needing to make HTTP calls
to a FHIR server over C (e.g. [sqlite-on-fhir](../sqlite/README.md)).

You **really** should be using literally any other
process than a raw C binary to pull FHIR data, so use with caution!!

## Scripts
1. Build:
```bash
make
```

2. (Build and) Add to user header and lib:
```bash
make install
```

3. Remove the user header and lib file
```bash
make uninstall
```

## Building
1. You need to install 2 libraries:

linux:
```bash
apt install jansson curl
```

mac (with [homebrew](http://brew.sh/)):
```bash
brew install jansson curl
```

2. Then run make
The default make reads compiles for your system (x86 on linux and mac right now)
```bash
make
```

3. (optional) Add/remove cfhir.h header and build output to /usr/local/include and /usr/local/lib
```bash
make install
make uninstall
```

## Conventions
The SIZE of a buffer is just how many bytes it has allocated for it.

Since char buffers are so common and needed to be interpreted as strings,
we call the LENGTH of any char buffer to be SIZE - 1 exactly.

So if you see a variable called referring to the length of an array,
this will almost always mean the STRING LENGTH (what you get from strlen()):
    size = length + 1
