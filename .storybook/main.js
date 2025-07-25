/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-vitest"
    ],
    framework: {
        name: "@storybook/web-components-vite",
        options: {}
    },
    staticDirs: ['public'],
    viteFinal: async (config) => {
        // Ensure raw markdown imports are allowed (e.g. ?raw)
        config.assetsInclude = [
            ...(config.assetsInclude || []),
            '**/*.md'
        ];
        return config;
    }
};

export default config;
