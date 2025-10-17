
import remarkLivecodes from "remark-livecodes";

export const livecodes = () => ({
    name: 'rspress-plugin-livecodes',
    markdown: {
        remarkPlugins: [remarkLivecodes],
    },
});