import React, { useEffect, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import { Stack, TextField, Typography, Button } from "@mui/material";

export interface Container {
  Names: string[];
  Ports: Port[];
}

export interface Port {
  PublicPort: number;
  Type: string;
}

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [authToken, setAuthToken] = useState<string>("");
  const [url, setUrl] = useState<string>("-");
  const ddClient = useDockerDesktopClient();

  // List containers when the component is mount (i.e. when entering the extension)
  useEffect(() => {
    listContainers();
  }, []);

  // Refresh list of containers when a new container is started or destroyed.
  // See all the events here: https://docs.docker.com/engine/reference/commandline/events/
  useEffect(() => {
    const containersEvents = async () => {
      await ddClient.docker.cli.exec(
        "events",
        [
          "--format",
          `"{{ json . }}"`,
          "--filter",
          "type=container",
          "--filter",
          "event=start",
          "--filter",
          "event=destroy",
        ],
        {
          stream: {
            async onOutput() {
              listContainers();
            },
            onClose(exitCode) {
              console.log("onClose with exit code " + exitCode);
            },
            splitOutputLines: true,
          },
        }
      );
    };

    containersEvents();
  }, []);

  const listContainers = () => {
    ddClient.docker
      .listContainers()
      .then((containers: Container[]) => {
        let containersExposingPorts = [];

        for (let index = 0; index < containers.length; index++) {
          const container = containers[index];
          if (container.Ports.length > 0) {
            containersExposingPorts.push(container);
          }
        }

        setContainers(containersExposingPorts);
      })
      .catch((err: Error) => {
        ddClient.desktopUI.toast.error(`Failed to list containers: ${err}`);
      });
  };

  const DisplayContainerPorts = (container: Container) => {
    let publishedPorts: string[] = [];

    for (var i = 0; i < container.Ports.length; i++) {
      let type = container.Ports[i].Type.toUpperCase();
      let port = container.Ports[i].PublicPort ?? "-";
      let publishedPort = "(" + type + ")" + " " + port;
      publishedPorts.push(publishedPort);
    }

    return (
      <td key={"ports-" + container.Names[0]}>
        {publishedPorts.length > 0 ? (
          publishedPorts.map((p) => <pre>{p}</pre>)
        ) : (
          <pre>-</pre>
        )}
      </td>
    );
  };

  // Make the container accessible from the internet
  // by running an ngrok container that targets the app's container port:
  // e.g. "docker run -e NGROK_AUTHTOKEN=***** --net=host ngrok/ngrok http 8080 --log stdout --log-format json"
  const exposeHandle = async (port: number) => {
    const runOutput = await ddClient.docker.cli.exec("run", [
      "-e",
      `NGROK_AUTHTOKEN=${authToken}`,
      "--net=host",
      "-d",
      "ngrok/ngrok",
      "http",
      `${port}`,
      "--log=stdout",
      "--log-format=json",
    ]);

    const containerId = runOutput.stdout.trimEnd();

    await ddClient.docker.cli.exec("logs", ["-f", containerId], {
      stream: {
        onOutput(data) {
          if (data.stdout) {
            console.log(data.stdout);

            // {"err":"\u003cnil\u003e","lvl":"info","msg":"open config file","path":"/var/lib/ngrok/ngrok.yml","t":"2022-06-07T11:05:40.822626057Z"}
            // {"addr":"0.0.0.0:4040","lvl":"info","msg":"starting web service","obj":"web","t":"2022-06-07T11:05:40.824277919Z"}
            // {"lvl":"info","msg":"tunnel session started","obj":"tunnels.session","t":"2022-06-07T11:05:41.025380757Z"}
            // {"id":"6da982f374ef","lvl":"info","msg":"client session established","obj":"csess","t":"2022-06-07T11:05:41.025537956Z"}
            // {"addr":"http://localhost:8080","lvl":"info","msg":"started tunnel","name":"command_line","obj":"tunnels","t":"2022-06-07T11:05:41.083489579Z","url":"https://f6fb-79-144-242-50.eu.ngrok.io"}
            // {"lvl":"info","msg":"update available","obj":"updater","t":"2022-06-07T11:05:41.307409645Z"}
            // {"id":"0d3c688ff241","l":"127.0.0.1:8080","lvl":"info","msg":"join connections","obj":"join","r":"79.144.242.50:53473","t":"2022-06-07T11:05:51.914187991Z"}
            // ^C{"lvl":"info","msg":"received stop request","obj":"app","stopReq":{},"t":"2022-06-07T11:05:55.301981768Z"}
            // {"err":"\u003cnil\u003e","lvl":"info","msg":"session closing","obj":"tunnels.session","t":"2022-06-07T11:05:55.302378322Z"}

            const stdOutJSON = JSON.parse(data.stdout);
            if (stdOutJSON.msg === "started tunnel") {
              setUrl(stdOutJSON.url);
            }
          } else {
            console.error(data.stderr);
          }
        },
        onError(error) {
          console.error(error);
        },
        onClose(exitCode) {
          console.log("onClose with exit code " + exitCode);
        },
        // If set to true, `onOutput` will be invoked once for each line.
        splitOutputLines: true,
      },
    });
  };

  const PrintTableHeaders = () => {
    return (
      <tr key="headers">
        {["Container", "Published ports", "URL"].map((h) => (
          <td key={h} width="250px">
            {h}
          </td>
        ))}
      </tr>
    );
  };

  const PrintTableRows = () => {
    return containers.map((container) => (
      <tr key={"ctr-row-" + container.Names[0]}>
        <td key={"ctr-name-" + container.Names[0]}>
          {container.Names[0].substring(1)}
        </td>

        {DisplayContainerPorts(container)}

        <td key={"urls-" + container.Names[0]}>
          <pre>{url}</pre>
        </td>

        <td key="actions-">
          {authToken !== "" && url === "-" && (
            <Button
              variant="contained"
              onClick={async () => exposeHandle(container.Ports[0].PublicPort)} // TODO: if many, select the port to expose
            >
              Expose
            </Button>
          )}

          {url !== "-" && (
            <Button
              sx={{ marginLeft: "20px" }}
              variant="contained"
              onClick={() => ddClient.host.openExternal(url)}
            >
              Open
            </Button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Typography variant="h3">Expose containers</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This is a sample extension to make your containers accessible from the
        public internet using Ngrok.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Host: {ddClient.host.hostname} ({ddClient.host.platform}/
        {ddClient.host.arch})
      </Typography>
      <Stack direction="column" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <TextField
          sx={{ width: 300 }}
          variant="outlined"
          type="password"
          minRows={5}
          onChange={(event) => {
            setAuthToken(event.target.value);
          }}
          value={authToken}
          placeholder="Ngrok auth token"
        />

        {containers.length > 0 ? (
          <div>
            <table style={{ width: "100%" }}>
              <thead>
                {PrintTableHeaders()}
                {PrintTableRows()}
              </thead>
            </table>
          </div>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              There are no running containers publishing ports (-p flag).
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Run one with "docker run --rm -p 8080:80 nginx"
            </Typography>
          </>
        )}
      </Stack>
    </>
  );
}
