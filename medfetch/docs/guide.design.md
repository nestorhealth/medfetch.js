# Design

## Web First
Medfetch is meant to run on *any* Javascript platform that support the [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) 
this library depends on internally. Keeping in mind database environment constraints, this means that ideally, Medfetch extensions
should **not** bundle in any additional dependencies that conflict with the database's intended platform. Some of these Web APIs include

- [`Atomics`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
- [`Worker`](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
- [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)
- [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

By building our SQL on FHIR interfaces "web-first", we can have Medfetch integrate with as many applications and 
as many use-cases as possible, no matter where the javascript actually runs! This ties in with the second design goal.

## Minimize Dependencies
This may seem contradictory for a library that's entirely reliant on [kysely](https://kysely.dev/) to run, but the overall
idea is to minimize the amount of static datasets (i.e. JSON schemas) that need to be bundled in with Medfetch, i.e. memory
that isn't "logic-code". Not only does this greatly remove the bundle size (always a plus) but by being able to treat schemas as 
"runtime" dependencies rather than "buildtime", this allows Medfetch to work with as many FHIR resources as possible while
also accounting for any variations across FHIR platforms.

In general, it's easier to use existing generic "runtime" based code to build static datasets when the best
solution to a certain data-bundle is to statically include it, rather than the other way around.

## Integrate over Replace
Medfetch was built to work *with* your existing FHIR tooling, not replace it. We think the FHIR ecosystem has
some great javascript tools out already (case in point, [fhirpath.js](https://hl7.github.io/fhirpath.js/)) and we believe
the fastest way to progress is to *build off* the shoulders of past giants, rather than haphazardly rebuild the past work
(more often than not unknowingly 😅).

That also happens to be my primary justification for choosing [Kysely](https://kysely.dev/) as the interface behind 
our SQL on FHIR client: so we don't have to reinvent an SQL querybuilder that will almost (certainly) be much worse
than existing clients. 

## In Practice
What is listed here are ultimately *guidelines* and not hard-set rules on this project, especially as it is still in its
earlier stages. For example, if we wanted to add in a [`node-postgres`](https://node-postgres.com/) extension in the future,
then it may not make as much sense to restrict yourself to NodeJS's Web API implementations only and reach for nodejs
specific tooling if we needed some kind of specialized routines using `fs` or something like that.

Currently, we are focusing on browser-based clients since database copies purely in browser memory are less risky to 
perform mutating database operations on than server-side ones. The current plan is to use the logic from the
browser builds and extract as much as possible into a platform-agnostic core at some point, which can then be
imported to build new driver support.