# Design
This page outlines the higher level design goals of this project.

## Web First
Medfetch is meant to run on *any* Javascript platform that support the [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) 
this library depends on internally. Keeping in mind database environment constraints, this means that ideally, Medfetch extensions
should **not** bundle in any additional dependencies that conflict with the database's intended platform. Some of these Web APIs include

- [`Atomics`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
- [`Worker`](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
- [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)
- [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

By building our interfaces "web-first", we can have Medfetch integrate with as many applications and 
as many use-cases as possible, no matter where the javascript actually runs! This ties in with the second design goal.

## Minimize Dependencies
This may seem contradictory for a library that's entirely reliant on [kysely](https://kysely.dev/) to run, but the overall
idea is to minimize the amount of static datasets (i.e. JSON schemas) that need to be bundled in with Medfetch, i.e. memory
that isn't "logic-code". Not only does this greatly remove the bundle size (always a plus) but by being able to treat schemas as 
"runtime" dependencies rather than "buildtime", this allows Medfetch to work with as many FHIR resources as possible while
also accounting for any variations across FHIR platforms.

In general, it's easier to use existing generic "runtime" based code to build static datasets when the best
solution to a certain data-bundle is to statically include it, rather than the other way around.

## In Practice
What is listed here are ultimately *guidelines* and not hard-set rules on this project, especially as it is still in its earlier stages,
so there aren't hardset rules on how to keep things "web" friendly
and "minimize" dependencies*.

::: info
*For example, if we wanted to add in a [`node-postgres`](https://node-postgres.com/) extension in the future,
then it may not make as much sense to restrict yourself to web apis only and reach for nodejs
specific tooling if we needed some kind of specialized routines using `fs` or something like that.
:::

Currently, we are focusing on browser-based clients since database copies purely in browser memory are less risky to 
perform mutating database operations on than server-side ones. 