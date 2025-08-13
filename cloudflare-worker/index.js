import { marked } from "marked";

// HTML template for rendered markdown sites
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1, h2, h3, h4, h5, h6 {
            margin: 2rem 0 1rem;
            line-height: 1.3;
        }
        h1 { font-size: 2.5rem; border-bottom: 2px solid #e1e4e8; padding-bottom: 0.3rem; }
        h2 { font-size: 2rem; border-bottom: 1px solid #e1e4e8; padding-bottom: 0.3rem; }
        h3 { font-size: 1.5rem; }
        p { margin: 1rem 0; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code {
            background: #f6f8fa;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre {
            background: #f6f8fa;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        pre code {
            background: transparent;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #666;
        }
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        li { margin: 0.5rem 0; }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1rem 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 0.6rem 1rem;
            text-align: left;
        }
        th {
            background: #f6f8fa;
            font-weight: 600;
        }
        hr {
            border: none;
            border-top: 2px solid #e1e4e8;
            margin: 2rem 0;
        }
        @media (max-width: 768px) {
            body { padding: 1rem; }
            h1 { font-size: 2rem; }
            h2 { font-size: 1.5rem; }
        }
        @media (prefers-color-scheme: dark) {
            body {
                background: #0d1117;
                color: #c9d1d9;
            }
            h1, h2 { border-color: #30363d; }
            code, pre, th { background: #161b22; }
            blockquote { border-color: #30363d; color: #8b949e; }
            th, td { border-color: #30363d; }
            hr { border-color: #30363d; }
            a { color: #58a6ff; }
        }
    </style>
</head>
<body>
    <div class="container">
        {{content}}
    </div>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // Extract subdomain
    const parts = hostname.split(".");
    if (parts.length < 2) {
      return new Response("Invalid domain", { status: 400 });
    }

    // Get the subdomain (first part of the hostname)
    const subdomain = parts[0];

    // Skip if it's www or the main domain
    if (subdomain === "www" || parts.length === 2) {
      return new Response("Not Found", { status: 404 });
    }

    try {
      // Try to get from cache first
      const cacheKey = `rendered:${subdomain}`;
      const cached = await env.CACHE.get(cacheKey);

      if (cached) {
        return new Response(cached, {
          headers: {
            "Content-Type": "text/html;charset=UTF-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      // Fetch markdown from R2
      const object = await env.SITES_BUCKET.get(
        `sites/${subdomain}/content.md`,
      );

      if (!object) {
        return new Response("Site not found", { status: 404 });
      }

      // Read markdown content
      const markdown = await object.text();

      // Parse frontmatter if present
      let title = subdomain;
      let description = "";
      let content = markdown;

      // Simple frontmatter parsing
      if (markdown.startsWith("---")) {
        const parts = markdown.split("---");
        if (parts.length >= 3) {
          const frontmatter = parts[1];
          content = parts.slice(2).join("---");

          // Extract title and description
          const titleMatch = frontmatter.match(/title:\s*(.+)/);
          const descMatch = frontmatter.match(/description:\s*(.+)/);

          if (titleMatch) title = titleMatch[1].trim();
          if (descMatch) description = descMatch[1].trim();
        }
      }

      // Convert markdown to HTML
      const renderedContent = marked(content);

      // Generate final HTML
      const html = HTML_TEMPLATE.replace("{{title}}", title)
        .replace("{{description}}", description)
        .replace("{{content}}", renderedContent);

      // Cache the rendered HTML for 1 hour
      ctx.waitUntil(env.CACHE.put(cacheKey, html, { expirationTtl: 3600 }));

      return new Response(html, {
        headers: {
          "Content-Type": "text/html;charset=UTF-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (error) {
      console.error("Error serving site:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
