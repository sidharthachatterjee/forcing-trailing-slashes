# Forcing Trailing Slashes

This example show how to force trailing slashes using a custom `_worker.js` file in your Cloudflare Pages project.

To run this locally, run `npm run build && npm run export` which will build and export your pages into the `out` folder and serve them using `wrangler` by running `npx wrangler pages dev ./out`.

## Behaviour

For all requests that are:

- not `/`
- not a URL serving a non HTML file e.g. `/_next/static/8TsXBbcStaPyWVGs7Mt1j/_buildManifest.js`

We add a trailing slash and redirect the request.

For requests to URLs that include a trailing slash, we opt out of the default behaviour (which strips them) and serve the page as is.

## Usage

Copy the `public/_worker.js` file into your project's build output directory and it should work as is.
