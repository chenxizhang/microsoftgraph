module.exports = ({ marp }) => marp.use((md) => {
    const { normalizeLink } = md

    md.normalizeLink = (...args) => {
        const originalResult = normalizeLink(...args)

        // Replace URL: ".md" -> ".html"
        return originalResult.replace(/\.md$/, '.html')
    }
})