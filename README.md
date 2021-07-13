[![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)](https://snyk.io)

[![Known Vulnerabilities](https://snyk.io/test/github/snyk/broker/badge.svg?style=flat-square)](https://snyk.io/test/github/snyk/broker)

***

# snyk/broker

Snyk Broker proxies access between snyk.io and your Git repositories, such as GitHub Enterprise, GitHub.com and Bitbucket Server. Snyk Broker can also be used to enable a secure connection with your on-premise Jira deployment.

The Broker server and client establish an applicative tunnel, proxying requests from snyk.io to the Git (fetching manifest files from monitored repositories), and vice versa (webhooks posted by the Git).

The Broker client runs within the user's internal network, keeping sensitive data such as Git tokens within the network perimeter. The applicative tunnel scans and adds only relevant requests to an approved list, narrowing down the access permissions to the bare minimum required for Snyk to actively monitor a repository.

## Usage

The Broker client is published as a set of Docker images, each configured for a specific Git. Standard and custom configuration is performed with environment variables as described below, per integration type.

### GitHub.com

To use the Broker client with GitHub.com, run `docker pull snyk/broker:github-com`. The following environment variables are mandatory to configure the Broker client:

- `BROKER_TOKEN` - the Snyk Broker token, obtained from your Snyk Org settings view (app.snyk.io).
- `GITHUB_TOKEN` - a personal access token with full `repo`, `read:org` and `admin:repo_hook` scopes.
- `PORT` - the local port at which the Broker client accepts connections. Default is 7341.
- `BROKER_CLIENT_URL` - the full URL of the Broker client as it will be accessible by GitHub.com webhooks, such as `http://my.broker.client:7341`

#### Command-line arguments

You can run the Docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e GITHUB_TOKEN=secret-github-token \
           -e PORT=8000 \
           -e BROKER_CLIENT_URL=http://my.broker.client:8000 \
       snyk/broker:github-com
```

Proxy configuration, see [Configure Docker to use a proxy server](https://docs.docker.com/network/proxy/)

```Proxy
           -e HTTP_PROXY=http://my.proxy.address:8080
           -e HTTPS_PROXY=http://my.proxy.address:8080
           -e NO_PROXY=*.test.example.com,.example2.com,127.0.0.0/8
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:github-com

ENV BROKER_TOKEN      secret-broker-token
ENV GITHUB_TOKEN      secret-github-token
ENV PORT              8000
ENV BROKER_CLIENT_URL http://my.broker.client:8000
```

### GitHub Enterprise

To use the Broker client with a GitHub Enterprise deployment, run `docker pull snyk/broker:github-enterprise` tag. The following environment variables are mandatory to configure the Broker client:

- `BROKER_TOKEN` - the Snyk Broker token, obtained from your Snyk Org settings view (app.snyk.io).
- `GITHUB_TOKEN` - a personal access token with full `repo`, `read:org` and `admin:repo_hook` scopes.
- `GITHUB` - the hostname of your GitHub Enterprise deployment, such as `your.ghe.domain.com`.
- `GITHUB_API` - the API endpoint of your GitHub Enterprise deployment. Should be `your.ghe.domain.com/api/v3`.
- `GITHUB_GRAPHQL` - the graphql endpoint of your GitHub Enterprise deployment. Should be `your.ghe.domain.com/api`.
- `PORT` - the local port at which the Broker client accepts connections. Default is 7341.
- `BROKER_CLIENT_URL` - the full URL of the Broker client as it will be accessible by your GitHub Enterprise deployment webhooks, such as `http://my.broker.client:7341`

#### Command-line arguments

You can run the docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e GITHUB_TOKEN=secret-github-token \
           -e GITHUB=your.ghe.domain.com \
           -e GITHUB_API=your.ghe.domain.com/api/v3 \
           -e GITHUB_GRAPHQL=your.ghe.domain.com/api \
           -e PORT=8000 \
           -e BROKER_CLIENT_URL=http://my.broker.client:8000 \
       snyk/broker:github-enterprise
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:github-enterprise

ENV BROKER_TOKEN      secret-broker-token
ENV GITHUB_TOKEN      secret-github-token
ENV GITHUB            your.ghe.domain.com
ENV GITHUB_API        your.ghe.domain.com/api/v3
ENV GITHUB_GRAPHQL    your.ghe.domain.com/api
ENV PORT              8000
ENV BROKER_CLIENT_URL http://my.broker.client:8000
```

### Bitbucket Server

To use the Broker client with a Bitbucket Server deployment, run `docker pull snyk/broker:bitbucket-server` tag. The following environment variables are mandatory to configure the Broker client:

- `BROKER_TOKEN` - the snyk broker token, obtained from your Bitbucket Server integration settings view (app.snyk.io).
- `BITBUCKET_USERNAME` - the Bitbucket Server username.
- `BITBUCKET_PASSWORD` - the Bitbucket Server password.
- `BITBUCKET` - the hostname of your Bitbucket Server deployment, such as `your.bitbucket-server.domain.com`.
- `BITBUCKET_API` - the API endpoint of your Bitbucket Server deployment. Should be `$BITBUCKET/rest/api/1.0`.
- `BROKER_CLIENT_URL` - the full URL of the Broker client as it will be accessible by your Bitbucket Server for webhooks, such as `http://my.broker.client:7341`
- `PORT` - the local port at which the Broker client accepts connections. Default is 7341.

#### Command-line arguments

You can run the docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e BITBUCKET_USERNAME=username \
           -e BITBUCKET_PASSWORD=password \
           -e BITBUCKET=your.bitbucket-server.domain.com \
           -e BITBUCKET_API=your.bitbucket-server.domain.com/rest/api/1.0 \
           -e BROKER_CLIENT_URL=http://my.broker.client:8000 \
           -e PORT=8000 \
       snyk/broker:bitbucket-server
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:bitbucket-server

ENV BROKER_TOKEN        secret-broker-token
ENV BITBUCKET_USERNAME  username
ENV BITBUCKET_PASSWORD  password
ENV BITBUCKET           your.bitbucket-server.domain.com
ENV BITBUCKET_API       your.bitbucket-server.domain.com/rest/api/1.0
ENV PORT                8000
```


### GitLab

To use the Broker client with GitLab.com or an on-prem GitLab deployment, run `docker pull snyk/broker:gitlab` tag. The following environment variables are mandatory to configure the Broker client:

- `BROKER_TOKEN` - the Snyk Broker token, obtained from your GitLab integration settings view (app.snyk.io).
- `GITLAB_TOKEN` - a GitLab personal access token with `api` scope
- `GITLAB` - the hostname of your GitLab deployment, such as `your.gitlab.domain.com` or `GitLab.com`.
- `PORT` - the local port at which the Broker client accepts connections. Default is 7341.
- `BROKER_CLIENT_URL` - the full URL of the Broker client as it will be accessible by GitLab.com webhooks, such as `http://my.broker.client:7341`

#### Command-line arguments

You can run the docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e GITLAB_TOKEN=secret-gitlab-token \
           -e GITLAB=your.gitlab.domain.com \
           -e BROKER_CLIENT_URL=http://my.broker.client:8000 \
           -e PORT=8000 \
       snyk/broker:gitlab
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:gitlab

ENV BROKER_TOKEN        secret-broker-token
ENV GITLAB_TOKEN        secret-gitlab-token
ENV GITLAB              your.gitlab.domain.com
ENV BROKER_CLIENT_URL   http://my.broker.client:8000
ENV PORT                8000
```

### Azure Repos

To use the Broker client with [Azure](https://azure.microsoft.com/en-us/services/devops/), run `docker pull snyk/broker:azure-repos` tag. The following environment variables are mandatory to configure the Broker client:

- `BROKER_TOKEN` - the Snyk Broker token, obtained from your Azure Repos integration settings view (app.snyk.io).
- `AZURE_REPOS_TOKEN` - an Azure Repos personal access token. [Guide](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page) how to get/create the token. Required scopes: ensure Custom defined is selected and under Code select _Read & write_
- `AZURE_REPOS_ORG` - organization name, which can be found in your Organization Overview page in Azure
- `AZURE_REPOS_HOST` - the hostname of your Azure Repos Server deployment, such as `your.azure-server.domain.com`.
- `PORT` - the local port at which the Broker client accepts connections. Default is 7341.
- `BROKER_CLIENT_URL` - the full URL of the Broker client as it will be accessible by your Azure Repos' webhooks, such as `http://my.broker.client:7341`

#### Command-line arguments

You can run the docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e AZURE_REPOS_TOKEN=secret-azure-token \
           -e AZURE_REPOS_ORG=org-name \
           -e AZURE_REPOS_HOST=your.azure-server.domain.com \
           -e BROKER_CLIENT_URL=http://my.broker.client:8000 \
           -e PORT=8000 \
       snyk/broker:azure-repos
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:azure-repos

ENV BROKER_TOKEN        secret-broker-token
ENV AZURE_REPOS_TOKEN   secret-azure-token
ENV AZURE_REPOS_ORG     org-name
ENV AZURE_REPOS_HOST    your.azure-server.domain.com
ENV BROKER_CLIENT_URL   http://my.broker.client:8000
ENV PORT                8000
```

### Artifactory

To use the Broker client with an artifactory deployment, run `docker pull snyk/broker:artifactory` tag. The following environment variables are needed to customize the Broker client:

- `BROKER_TOKEN` - the snyk broker token, obtained from your artifactory integration settings view.
- `ARTIFACTORY_URL` - the URL of your artifactory deployment, such as `<yourdomain>.artifactory.com/artifactory`.

#### Command-line arguments

You can run the docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e ARTIFACTORY_URL=<yourdomain>.artifactory.com/artifactory \
       snyk/broker:artifactory
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:artifactory

ENV BROKER_TOKEN      secret-broker-token
ENV ARTIFACTORY_URL   <yourdomain>.artifactory.com
```

### Jira

To use the Broker client with a Jira deployment, run `docker pull snyk/broker:jira` tag. The following environment variables are mandatory to configure the Broker client:

- `BROKER_TOKEN` - the Snyk Broker token, obtained from your Jira integration settings view.
- `JIRA_USERNAME` - the Jira username.
- `JIRA_PASSWORD` - the Jira password.
- `JIRA_HOSTNAME` - the hostname of your Jira deployment, such as `your.jira.domain.com`.
- `BROKER_CLIENT_URL` - the full URL of the Broker client as it will be accessible by your Jira for webhooks, such as `http://my.broker.client:7341`
- `PORT` - the local port at which the Broker client accepts connections. Default is 7341.

#### Command-line arguments

You can run the docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e JIRA_USERNAME=username \
           -e JIRA_PASSWORD=password \
           -e JIRA_HOSTNAME=your.jira.domain.com \
           -e BROKER_CLIENT_URL=http://my.broker.client:8000 \
           -e PORT=8000 \
       snyk/broker:jira
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:jira

ENV BROKER_TOKEN        secret-broker-token
ENV JIRA_USERNAME       username
ENV JIRA_PASSWORD       password
ENV JIRA_HOSTNAME       your.jira.domain.com
ENV PORT                8000
```

### Container registry agent

To use the Broker client with a container registry agent deployment, run `docker
pull snyk/broker:container-registry-agent`. The following environment variables
are mandatory to configure the Broker client:

- `BROKER_TOKEN` - The Snyk Broker token, obtained from your Container registry integration settings (app.snyk.io).
- `BROKER_CLIENT_URL` - The URL of your broker client (including scheme and - port) used by container registry agent to call back to Snyk.
- `CR_AGENT_URL` - The URL of your container registry agent (including scheme and - port) to which brokered requests would be forwarded.
- `CR_CREDENTIALS` - Base64-encoded credentials json used by agent to access container registry.
- `PORT` - The local port at which the Broker client accepts connections. Default is 7341.

#### Command-line arguments

You can run the docker container by providing the relevant configuration:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e BROKER_CLIENT_URL=https://my.broker.client:8000 \
           -e CR_AGENT_URL=https://my.container.registry.agent \
           -e CR_CREDENTIALS=base64-encoded-credentials-json \
           -e PORT=8000 \
       snyk/broker:container-registry-agent
```

#### Derived docker image

Another option is to build your own docker image and override relevant environment variables:

```dockerfile
FROM snyk/broker:container-registry-agent

ENV BROKER_TOKEN          secret-broker-token
ENV BROKER_CLIENT_URL     https://my.broker.client:8000
ENV CR_AGENT_URL          https://my.container.registry.agent
ENV CR_CREDENTIALS        base64-encoded-credentials-json
ENV PORT                  8000
```

### Monitoring

#### Healthcheck

The Broker exposes an endpoint at `/healthcheck`, which can be used to monitor the health of the running application. This endpoint responds with status code `200 OK` when the internal request is successful, and returns `{ ok: true }` in the response body.

In the case of the Broker client, this endpoint also reports on the status of the Broker websocket connection.  If the websocket connection is not open, this endpoint responds with status code `500 Internal Server Error` and `{ ok: false }` in the response body.

To change the location of the healthcheck endpoint, you can specify an alternative path via an environment variable:

```dockerfile
ENV BROKER_HEALTHCHECK_PATH /path/to/healthcheck
```

#### Systemcheck

The Broker client exposes an endpoint at `/systemcheck`, which can be used to validate the brokered service (Git or the like) connectivity and credentials. This endpoint causes the Broker client to make a request to a preconfigured URL, and report on the success of the request. The supported configuration is:

* `BROKER_CLIENT_VALIDATION_URL` - the URL to which the request will be made.
* `BROKER_CLIENT_VALIDATION_AUTHORIZATION_HEADER` - [optional] the `Authorization` header value of the request. Mutually exclusive with `BROKER_CLIENT_VALIDATION_BASIC_AUTH`.
* `BROKER_CLIENT_VALIDATION_BASIC_AUTH` - [optional] the basic auth credentials (`username:password`) to be base64 encoded and placed in the `Authorization` header value of the request. Mutually exclusive with `BROKER_CLIENT_VALIDATION_AUTHORIZATION_HEADER`.
* `BROKER_CLIENT_VALIDATION_METHOD` - [optional] the HTTP method of the request (default is `GET`).
* `BROKER_CLIENT_VALIDATION_TIMEOUT_MS` - [optional] the request timeout in milliseconds (default is 5000 ms).

This endpoint responds with status code `200 OK` when the internal request is successful, and returns `{ ok: true }` in the response body. If the internal request fails, this endpoint responds with status code `500 Internal Server Error` and `{ ok: false }` in the response body.

To change the location of the systemcheck endpoint, you can specify an alternative path via an environment variable:

```dockerfile
ENV BROKER_SYSTEMCHECK_PATH /path/to/systemcheck
```

#### Logging

By default the log level of the Broker is set to INFO. All SCM responses regardless of HTTP status code will be logged by the Broker client. The following settings can be set in your environment variables to alter the logging behaviour:

| Key  | Default | Notes |
|---|---|---|
| LOG_LEVEL | info | Set to "debug" for all logs |
| LOG_ENABLE_BODY | false | Set to "true" to include the response body in the Client logs |

### Advanced Configuration

#### HTTPS

The Broker client runs an HTTP server by default. It can be configured to run an HTTPS server for local connections. This requires an SSL certificate and a private key to be provided to the docker container at runtime.

For example, if your certificate files are found locally at `./private/broker.crt` and `./private/broker.key`, provide these files to the docker container by mounting the folder and using the `HTTPS_CERT` and `HTTPS_KEY` environment variables:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e GITHUB_TOKEN=secret-github-token \
           -e PORT=8000 \
           -e HTTPS_CERT=/private/broker.crt \
           -e HTTPS_KEY=/private/broker.key \
           -e BROKER_CLIENT_URL=https://my.broker.client:8000 \
           -v /local/path/to/private:/private \
       snyk/broker:github-com
```

Note that `BROKER_CLIENT_URL` now has the HTTPS scheme.

#### Git with an internal certificate

By default, the Broker client establishes HTTPS connections to the Git. If your Git is serving an internal certificate (signed by your own CA), you can provide the CA certificate to the Broker client.

For example, if your CA certificate is at `./private/ca.cert.pem`, provide it to the docker container by mounting the folder and using the `CA_CERT` environment variable:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e BITBUCKET_USERNAME=username \
           -e BITBUCKET_PASSWORD=password \
           -e BITBUCKET=your.bitbucket-server.domain.com \
           -e BITBUCKET_API=your.bitbucket-server.domain.com/rest/api/1.0 \
           -e PORT=8000 \
           -e CA_CERT=/private/ca.cert.pem \
           -v /local/path/to/private:/private \
       snyk/broker:bitbucket-server
```

### Custom approved-listing filter

The default approved-listing filter supports the bare minimum to operate on all repositories supported by Snyk. In order to customize the approved-listing filter, create the default one locally by installing `snyk-broker` and running `broker init [Git type]`. The created `accept.json` is the default filter for the chosen Git. Place the file in a separate folder such as `./private/accept.json`, and provide it to the docker container by mounting the folder and using the `ACCEPT` environment variable:

```console
docker run --restart=always \
           -p 8000:8000 \
           -e BROKER_TOKEN=secret-broker-token \
           -e GITHUB_TOKEN=secret-github-token \
           -e PORT=8000 \
           -e BROKER_CLIENT_URL=https://my.broker.client:8000 \
           -e ACCEPT=/private/accept.json
           -v /local/path/to/private:/private \
       snyk/broker:github-com
```

#### Types of Filtering

##### By Header

Add a validation block with the following key/values:

| Key | Value | Value Type | Example |
|-|-|-|-|
| header | The name of the header you wish to filter on. If this is defined then the named header must explicitly exist on the request otherwise it will be blocked | String | `accept` |
| values | The header value must match one of the defined strings | Array\<String\> | `["application/vnd.github.v4.sha"]` |

For example, to only allow the SHA Media Type accept header for requests to the GitHub Commits API you would add the following:

```json
{
    "method": "GET",
    "path": "/repos/:name/:repo/commits/:ref",
    "origin": "https://${GITHUB_TOKEN}@${GITHUB_API}",
    "valid": [
        {
            "header": "accept",
            "values": ["application/vnd.github.v4.sha"]
        }
    ]
}
```

### Mounting Secrets
Sometime it is required to load sensitive configurations (GitHub/Snyk's token) from a file instead from environment variables. Broker is using [dotenv](https://www.npmjs.com/package/dotenv) to load the config, so the process is relatively simple:
* Create a file named `.env` and put your sensitive config there:
* Mount this file (for example, using [Kubernetes secret](https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume)). Mount the file to be somewhere like `/broker`.
* Change the workdir of the docker image to be `/broker`/
Example of such file is located in your broker container at $HOME/.env

### Troubleshooting

#### Support of big manifest files (> 1Mb) for GitHub / GitHub Enterprise

One of the reason for failing of open Fix/Upgrade PRs or PR/recurring tests might be fetching big manifest files (> 1Mb) failure. To address this issue, additional Blob API endpoint should be whitelisted in `accept.json`:

- should be in `private` array
```json
{
    "//": "used to get given manifest file",
    "method": "GET",
    "path": "/repos/:owner/:repo/git/blobs/:sha",
    "origin": "https://${GITHUB_TOKEN}@${GITHUB_API}"
}
```
**Note** To ensure the maximum possible security, we do not enable this rule by default, as usage of this endpoint means that the Snyk platform can theoretically access all files in this repository, as the path does not include specific allowed file names.

## Misc

* [License: Apache License, Version 2.0](https://github.com/snyk/broker/blob/master/LICENSE)
* [Contributing](https://github.com/snyk/broker/blob/master/.github/CONTRIBUTING.md)
* [Security](https://github.com/snyk/broker/blob/master/SECURITY.md)
