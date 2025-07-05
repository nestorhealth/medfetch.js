<script setup lang="ts">
import ReactFunctionsList from "./components/ReactFunctionsList.vue";
</script>

# Medfetch.js x `React`
You don't need [React](https://react.dev/) to run Medfetch, but if you are using
a React based frontend, then we have some helper functions available to use.

You need [Tanstack Query (React Query)](https://tanstack.com/query/latest/docs/framework/react/overview) installed:

```bash
pnpm add @tanstack/react-query
```
And then [setup](https://tanstack.com/query/v5/docs/framework/react/quick-start) their QueryClient.

That's it!

::: tip
Our apps are written using [Next.js](https://nextjs.org/), so even though
the client functions inside `medfetch/next.client` specifically do **NOT** use any Next.js specific
functions, we can only promise that our React hooks will run smoothly on Next.js based projects since
that's what we test on.
:::

<ReactFunctionsList />