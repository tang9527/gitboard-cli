> View contributions of developers under the console

<p align="center">
  <img width="600" src="https://cdn.rawgit.com/marionebl/svg-term-cli/1250f9c1/examples/parrot.svg">
</p>

# gitboard-cli

- 🤖 CLI to view contributions of developers

## Install

It is recommended to install Gitboard-cli through the [npm package manager](http://npmjs.org/), which comes bundled with [Node.js](https://nodejs.org/) when you install it on your system.

Once you have npm installed you can run the following both to install and upgrade Gitboard-cli:

```sh
npm install -g gitboard-cli
```

## Usage

```
gb rank
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
