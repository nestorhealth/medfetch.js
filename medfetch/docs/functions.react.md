<script setup lang="ts">
import ReactFunctionsList from "./components/ReactFunctionsList.vue";
</script>

# React
You don't need [React](https://react.dev/) to run Medfetch, but if you are using
a React based frontend, then we have some helper functions available to use.

You need [Tanstack Query (React Query)](https://tanstack.com/query/latest/docs/framework/react/overview) installed:

```bash
pnpm add @tanstack/react-query
```
And then [setup](https://tanstack.com/query/v5/docs/framework/react/quick-start) their QueryClient.

That's it!

<ReactFunctionsList />