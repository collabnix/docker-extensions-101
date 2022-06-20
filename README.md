# List of Docker Desktop CLI Extension

Building a bunch of CLI extensions for Docker Desktop


## Getting Started

Below instructions are for Apple Macbook M1 Pro Apple Chip system:


- [Download and Install](https://www.docker.com/products/docker-desktop/) Docker Desktop

<img width="594" alt="image" src="https://user-images.githubusercontent.com/34368930/174529940-1dfc7e51-cc28-4de5-8395-b73c7f13a151.png">

- Enable Docker Extensions


<img width="1091" alt="image" src="https://user-images.githubusercontent.com/34368930/174530063-563b9a41-bb97-41a9-bd2d-d66a01fd37dd.png">


- Install Docker Extension CLI

[Download Docker Extension CLI from this link](https://github.com/docker/extensions-sdk/releases/download/v0.2.4/desktop-extension-cli-darwin-arm64.tar.gz)

```
docker extension   

Usage:  docker extension [OPTIONS] COMMAND

Manages Docker extensions

Options:
      --socket string   The Desktop extension manager socket

Management Commands:
  dev             Extension development helpers

Commands:
  disable         Disable extensions in Docker Desktop
  enable          Enable extensions in Docker Desktop
  init            Create a new desktop extension
  install         Install a Docker extension with the specified image
  ls              List installed Docker extensions
  rm              Removes a Docker extension
  update          removes and re-install a Docker extension
  validate        Validate extension extension image or metadata file
  version         Print the client and server versions

Run 'docker extension COMMAND --help' for more information on a command.
```

- Listing the Docker Extensions

```
docker extension ls
```

- Test driving the Minimal Docker CLI Extension

```
git clone https://github.com/docker/extensions-sdk/
cd /samples/minimal-docker-cli
```

- Building the Extension

```
 make build-extension
docker build --tag=docker/minimal-docker-cli-extension:latest .
[+] Building 2.7s (15/15) FINISHED                                                                                                                  
 => [internal] load build definition from Dockerfile                                                                                           0.0s
 => => transferring dockerfile: 1.72kB                                                                                                         0.0s
 => [internal] load .dockerignore                                                                                                              0.0s
 => => transferring context: 2B                                                                                                                0.0s
 => [internal] load metadata for docker.io/library/node:17.7-alpine3.14                                                                        2.6s
 => [client-builder 1/8] FROM docker.io/library/node:17.7-alpine3.14@sha256:539e64749f7dc6c578d744d879fd0ec37f3afe552ae4aca9744cc85121728c4c   0.0s
 => [internal] load build context                                                                                                              0.0s
 => => transferring context: 416.06kB                                                                                                          0.0s
 => CACHED [client-builder 2/8] WORKDIR /app/client                                                                                            0.0s
 => CACHED [client-builder 3/8] COPY client/package.json /app/client/package.json                                                              0.0s
 => CACHED [client-builder 4/8] COPY client/yarn.lock /app/client/yarn.lock                                                                    0.0s
 => CACHED [client-builder 5/8] RUN yarn config set cache-folder /usr/local/share/.cache/yarn-arm64                                            0.0s
 => CACHED [client-builder 6/8] RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-arm64 yarn                                          0.0s
 => CACHED [client-builder 7/8] COPY client /app/client                                                                                        0.0s
 => CACHED [client-builder 8/8] RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-arm64 yarn build                                    0.0s
 => CACHED [stage-1 1/2] COPY --from=client-builder /app/client/dist ui                                                                        0.0s
 => CACHED [stage-1 2/2] COPY metadata.json .                                                                                                  0.0s
 => exporting to image                                                                                                                         0.0s
 => => exporting layers                                                                                                                        0.0s
 => => writing image sha256:1ca1b1b61e281756c61ee9c42e90f9c6e0231c988c2417799fb348b4e74559e3                                                   0.0s
 => => naming to docker.io/docker/minimal-docker-cli-extension:latest
```
 
- Installing the Extension

```
docker extension install docker/minimal-docker-cli-extension:latest
```

- Accessing the Docker Extension

<img width="506" alt="image" src="https://user-images.githubusercontent.com/34368930/174530647-10b2f2c3-d064-4664-bc0a-5a88f33841ee.png">



