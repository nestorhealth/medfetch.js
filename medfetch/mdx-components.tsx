import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";

const themeComponents = getThemeComponents();

export const useMDXComponents: typeof getThemeComponents = (components) => {
    return {
        ...themeComponents,
        ...components
    }
}
