# IRNMN Components
This repository contains a collection of web components for use in Irnmn projects.

## Installation
This repo contains all components in one repo. If there are many updates we may consider moving each theme to it's own repo. For now, you can inlcude the whole repo into your existing build setup using `npm` and a `package.json`. eg:

"dependencies": {
    "irnmn-components": "github:ennismore/irnmn-components#<tag-name>"
}

Example:

```bash
npm i https://github.com/ennismore/irnmn-components.git#v1.0.4
```


## Usage
The only build script currently is just to run some linting and formatting. You can run `npm run prettier:js` to format all `.js` files. There is also a pre-commit hook that will fire that will lint all files before committing.

To test a component locally, you need to run a local dev server. A simple approach to this can be just run `npx http-server /path/to/project -o -p 9999` which creates a simple node server you can access the components.

## Deployment
For now, there is no current deployment process. Each component should be pulled into the build process of the site it is being used in. This may change in future.

For each change to be correctly pulled in, we need to create a "release" tag and update that in the target dependency `package.json` file. Once you have made enough changes that a new release is needed, the process for this should be to create a new branch named `release/v1.0.1` and give it the new version number. Make updates to the `changelog.md` file with all changes that will be part of this release version. Add a tag number `git tag -a v1.0.1 -m "version 1.0.1"`. Checkout `main` branch and then merge the release branch into main and push. You will also need to push the tags `git push --tags. You can also create a PR from the release branch and merge via github process.

## Import the components in a custom build (like a child-theme)
After installing the irnmn-components using npm, it's still necessary to import the components in the custom build.

Example:

```bash
import "irnmn-components/location";
import "irnmn-components/calendar";
```
