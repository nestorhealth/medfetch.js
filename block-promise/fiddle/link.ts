import block from "../src/block-promise";

export const [syncFetch, handle] = block(
    async () => {
        const response = await fetch("https://r4.smarthealthit.org/Patient");
        const payload = await response.json();
        return payload as { resourceType: "Bundle" };
    }
);