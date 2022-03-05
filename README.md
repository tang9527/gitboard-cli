> View contributions of developers in the git repository

<p align="center">
  <img width="600" src="https://cdn.jsdelivr.net/npm/gitboard-cli@0.3.1/examples/gb.svg">
</p>

# gitboard-cli

- 🤖 CLI to view contributions of developers

## Install

**IMPORTANT:** [Node.js](https://nodejs.org/) version should be above 16.0.0

It is recommended to install Gitboard-cli through the [npm package manager](http://npmjs.org/), which comes bundled with [Node.js](https://nodejs.org/) when you install it on your system.

Once you have npm installed you can run the following both to install and upgrade Gitboard-cli:

```sh
npm install --global gitboard-cli
```

## Usage

> In the directory where the Git repository is located, execute the following commands👇

```sh
gb rank
```

or

```sh
gb status
```

or

```sh
gb rank --top 20 --after=2022-1-1 --before=2022-2-1
```

or

```sh
gb status --after=2022-1-1 --before=2022-2-1
```

## Interface

```
λ gb --help

  Usage: gb [options] [command]

  CLI to view contributions of developers

  Options
    -V, --version     output the version number
    -h, --help        display help for command
  Commands:
    clean             clean the cache
    rank [options]    rank of contributions
    status [options]  basic information of the repository
    help [command]    display help for command

  Examples
    $ gb rank
    $ gb status
```

## License

Copyright 2022. Released under the MIT license.
