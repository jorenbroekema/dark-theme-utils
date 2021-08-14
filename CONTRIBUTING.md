# Contributing

Contributions are very welcome. Best to start with creating an issue if it's something non-trivial.

## Local dev

Install

```sh
git clone https://github.com/jorenbroekema/dark-theme-utils.git
cd dark-theme-utils

# Install dependencies
npm i

# Create a branch for your changes
git checkout -b fix/some-bug
```

### Compile

Compile TS code

```sh
npm run compile
```

Or in watch-mode

```sh
npm run compile:watch
```

### Run Demo

```sh
npm run demo
```

Or in watch-mode

```sh
npm run demo:watch
```

### Check your code for linting/formatting issues

```sh
# fixes things that don't need user intervention
npm run format

# check there are no issues
npm run lint
```

## Contributing your changes

Fork this repository, <https://github.com/jorenbroekema/dark-theme-utils> click on fork (at the top right).

```sh
# add fork to your remotes
git remote add fork https://github.com/<your-user>/dark-theme-utils.git

# push new branch to your fork
git push -u fork fix/some-bug
```

> Keeping origin remote as the main remote makes it easy to keep in sync, your fork is just the "publishing target" of your branch.
