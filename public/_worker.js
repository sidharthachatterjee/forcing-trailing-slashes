export default {
  async fetch(request, env) {
    let { pathname, origin, search } = new URL(request.url);

    // Ignores root or any pages which end with an extension other than .html
    const REGEX = /\/[a-zA-Z-]+(\.html|\/)?$/i;

    if (pathname.match(REGEX)) {
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

        if (assetEntry.status === 200) {
          return new Response(null, {
            // Temporary
            status: 302,
            headers: {
              Location: `${pathname}/${search}`,
            },
          });
        }
      }
    }

    // Fall back to asset server
    return env.ASSETS.fetch(request.url, request);
  },
};
