# Plaid quickstart

This repository is one of client libraries that typically accompany Plaid's [**quickstart guide**][quickstart].

Specifically, this repo has been refactored for Typescript and Node. 

To learn more about Typescript, visit **https://www.typescriptlang.org/**

To learn more about NodeJS, visit **https://nodejs.org/**

## Table of contents

<!-- toc -->

- [1. Clone the repository](#1-clone-the-repository)
- [2. Set up your environment variables](#2-set-up-your-environment-variables)
- [3. Run the quickstart](#3-run-the-quickstart)
  - [Run without Docker](#run-without-docker)
    - [Pre-requisites](#pre-requisites)
    - [Running](#running)
      - [Node](#node)
- [Testing OAuth](#testing-oauth)

<!-- tocstop -->

## 1. Clone the repository

Using https:

```
$ git clone https://github.com/plaid/quickstart
$ cd quickstart
```

Alternatively, if you use ssh:

```
$ git clone git@github.com:plaid/quickstart.git
$ cd quickstart
```

## 2. Set up your environment variables

```
$ cp .env.example .env
```

Copy `.env.example` to a new file called `.env` and fill out the environment variables inside. At
minimum `PLAID_CLIENT_ID` and `PLAID_SECRET` must be filled out. Get your Client ID and secrets from
the dashboard: https://dashboard.plaid.com/account/keys

> NOTE: `.env` files are a convenient local development tool. Never run a production application
> using an environment file with secrets in it.

## 3. Run the quickstart

The original library provides two ways to run the quickstart in this repository. You can simply run the
code directly, or you can choose to use Docker. Unfortunately, you'd have to do the work to run with Docker.

If you are using Windows and choose not to use Docker, this quickstart assumes you are using some
sort of Unix-like environment on Windows, such as Cygwin or WSL. Scripts in this repo may rely on
things such as `bash`, `grep`, `cat`, etc.

### Run without Docker

#### Pre-requisites

- The language you intend to use is installed on your machine and available at your command line.
  This repo should generally work with active LTS versions of each language such as node >= 12,
  python >= 3.8, ruby >= 2.6, etc.
- Your environment variables populated in `.env`

#### Running

Once started with one of the commands below, the quickstart will be running on http://localhost:8000

##### Node

```
$ yarn install
$ node index.ts
```

## Testing OAuth

Some European institutions require an OAuth redirect authentication flow, where the end user is
redirected to the bank’s website or mobile app to authenticate. For this flow, you should set
`PLAID_REDIRECT_URI=http://localhost:8000/oauth-response.html` in `.env`. You will also need to
register this localhost redirect URI in the [Plaid dashboard under Team Settings > API > Allowed
redirect URIs][dashboard-api-section].

OAuth flows are only testable in the `sandbox` environment in this quickstart app due to an https
`redirect_uri` being required in other environments. Additionally, if you want to use the [Payment
Initiation][payment-initiation] product, you will need to [contact Sales][contact-sales] to get this
product enabled.

[quickstart]: https://plaid.com/docs/quickstart
[libraries]: https://plaid.com/docs/api/libraries
[payment-initiation]: https://plaid.com/docs/payment-initiation/
[node-example]: /node
[dashboard-api-section]: https://dashboard.plaid.com/team/api
[contact-sales]: https://plaid.com/contact
