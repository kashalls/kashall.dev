export default defineAppConfig({
    ui: {
        colors: {
            primary: 'purple',
            neutral: 'slate'
        },
        prose: {
            // Code block tab icons by file extension; unmapped ones fall back to the uninstalled vscode-icons set.
            codeIcon: {
                container: 'i-simple-icons-podman',
            },
        },
    }
})
