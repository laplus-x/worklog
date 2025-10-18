
import type { EmbedOptions } from "livecodes";
import remarkLivecodes from "remark-livecodes";
import type { RspressPlugin } from "rspress/core";

type Options = Omit<EmbedOptions, "headless"> & {
    auto?: boolean
    render?: "button" | "link" | "playground" | "meta"
    height?: string
    className?: string
};

export const livecodes = (options?: Options): RspressPlugin => ({
    name: 'rspress-plugin-livecodes',
    markdown: {
        remarkPlugins: [() => remarkLivecodes(options)],
    },
});