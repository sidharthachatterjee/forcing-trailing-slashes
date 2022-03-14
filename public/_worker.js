export default {
  async fetch(request, env) {
    let { pathname, origin, search } = new URL(request.url);

    if (pathname !== "/") {
      // Serve requests with trailing slashes
      if (pathname.endsWith("/")) {
        const assetUrlWithoutTrailingSlash = new URL(
          pathname.slice(0, -1),
          origin
        );

        const assetEntry = await env.ASSETS.fetch(
          assetUrlWithoutTrailingSlash,
          request
        );

        if (assetEntry.status === 200) {
          return assetEntry;
        }
      }
      // Redirect requests without trailing slashes
      else {
        const assetUrlWithTrailingSlash = new URL(
          `${pathname}/${search}`,
          origin
        );

        const assetEntry = await env.ASSETS.fetch(
          assetUrlWithTrailingSlash,
          request
        );

        if (
          assetEntry.status === 200 &&
          assetEntry.headers.get("content-type").includes("text/html")
        ) {
          return new Response(null, {
            // Temporary
            status: 302,
            headers: {
              Location: assetUrlWithTrailingSlash,
            },
          });
        }
      }
    }

    // Fall back to asset server
    return env.ASSETS.fetch(request.url, request);
  },
};
