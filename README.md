# The Graph Networks Registry

This is a simple demo app for the [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry) hosted at https://graph-networks.pinax.network

It uses [the Registry Typescript library](https://github.com/pinax-network/graph-networks-libs/) to fetch the registry JSON.

If something doesn't look right please open an issue or submit a PR in [the Registry repository](https://github.com/graphprotocol/networks-registry)

## Deployment

Every push to `main` builds a container image, `ghcr.io/pinax-network/graph-networks-app:<sha7>-<unix-ts>`
(`.github/workflows/container.yml`, from the `Dockerfile`). It runs on Kubernetes, deployed by
[`pinax-network/k8s-pinax-ui`](https://github.com/pinax-network/k8s-pinax-ui): Flux opens a
"Deploy to prod" pull request there for each new image, and merging it deploys.

To try the image locally:

```bash
docker build -t graph-networks-app .
docker run --rm -p 3000:3000 graph-networks-app
```
