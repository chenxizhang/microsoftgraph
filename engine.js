const script = `
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6MN194TCGY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-6MN194TCGY');
</script>
`

module.exports = ({ marp }) => marp.use((md) => {
    const { normalizeLink } = md

    md.normalizeLink = (...args) => {
        const originalResult = normalizeLink(...args)

        // Replace URL: ".md" -> ".html"
        return originalResult.replace(/\.md$/, '.html')
    }

    // Remember old renderer, if overridden, or proxy to default renderer
    // @see https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
    const defaultRender =
        md.renderer.rules.marpit_slide_open ||
        function (tokens, i, opts, _, slf) {
            return slf.renderToken(tokens, i, opts)
        }

    // "marpit_slide_open" token type is meaning the opening tag of
    // Marpit-compatible slide. Commonly it would be rendered as <section> tag.
    // @see https://github.com/marp-team/marpit/blob/main/src/markdown/slide.js
    md.renderer.rules.marpit_slide_open = function (tokens, i, opts, env, slf) {
        // Pass token to default renderer and store the rendered HTML
        const rendered = defaultRender(tokens, i, opts, env, slf)

        // The slide index has stored in meta.marpitSlide.
        const { meta } = tokens[i]

        // If it is the first slide, prepend <script> tag before the rendered tag.
        if (meta && meta.marpitSlide === 0) return script + rendered

        return rendered
    }
})