# List of Docker Desktop CLI Extensions

Building a bunch of CLI extensions for Docker Desktop

## Table of Contents

1. [Get Docker Info](#get-docker-info)
2. [Get Docker Images Architecture](#get-docker-images-architecture)

## Get Docker Info

The sample code is built by Docker Team and published [here](https://docs.docker.com/desktop/extensions-sdk/tutorials/minimal-frontend-using-docker-cli/)

### Getting Started

1. [Apple Macbook M1 Pro Installation](#instructions-are-for-apple-macbook-m1-pro-apple-chip-system)

2. [Windows Installation](#windows-installation)

#### Instructions for Apple Macbook M1 Pro Apple Chip system:

- [Download](https://www.docker.com/products/docker-desktop/) and Install Docker Desktop
- Enable Docker Extensions

<img width="1091" alt="image" src="https://user-images.githubusercontent.com/34368930/174530063-563b9a41-bb97-41a9-bd2d-d66a01fd37dd.png">

- [Download Docker Extension CLI from this link](https://github.com/docker/extensions-sdk/releases/download/v0.2.4/desktop-extension-cli-darwin-arm64.tar.gz)

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

- [Accessing the Docker Extension](#accessing-the-docker-extension)

### Get Docker Images Architecture

#### Windows installation

- [Download Docker Extension CLI from this link](https://github.com/docker/extensions-sdk/releases/download/v0.2.4/desktop-extension-cli-windows-amd64.tar.gz)

Extract the tar file by running (Make sure you are in downloads folder)

```
tar -xf desktop-extension-cli-windows-amd64.tar.gz
```

You'll get a docker-extension.exe file. For command promt to recognize this you can add a path variable or move the docker-extension.exe file to docker bin folder
whose path looks something like this

```
C:\Program Files\Docker\Docker\resources\bin
```

To check if the docker-extension is recognized you can run `docker-extension` on your command promt and you should get something like this

```
Usage:  docker [OPTIONS] COMMAND

docker-extension is a Docker CLI plugin

Options:
      --config string      Location of client config files (default
                           "C:\\Users\\rohit\\.docker")
  -c, --context string     Name of the context to use to connect to the
                           daemon (overrides DOCKER_HOST env var and
                           default context set with "docker context use")
  -D, --debug              Enable debug mode
  -H, --host list          Daemon socket(s) to connect to
  -l, --log-level string   Set the logging level
                           ("debug"|"info"|"warn"|"error"|"fatal")
                           (default "info")
      --tls                Use TLS; implied by --tlsverify
      --tlscacert string   Trust certs signed only by this CA (default
                           "C:\\Users\\rohit\\.docker\\ca.pem")
      --tlscert string     Path to TLS certificate file (default
                           "C:\\Users\\rohit\\.docker\\cert.pem")
      --tlskey string      Path to TLS key file (default
                           "C:\\Users\\rohit\\.docker\\key.pem")
      --tlsverify          Use TLS and verify the remote

Management Commands:
  completion                 generate the autocompletion script for the specified shell
  extension                  Manages Docker extensions

Run 'docker COMMAND --help' for more information on a command.

To get more help with docker, check out our guides at https://docs.docker.com/go/guides/
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

- Installing the extension

```
docker-extension extension install minimal-docker-cli-extension:latest
```

### Accessing the Docker Extension

<img width="506" alt="image" src="https://user-images.githubusercontent.com/34368930/174530647-10b2f2c3-d064-4664-bc0a-5a88f33841ee.png">

### Get Docker Images Architecture
