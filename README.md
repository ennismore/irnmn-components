# IRNMN Components
This repository contains a collection of web components for use in Irnmn projects.

## Installation
This repo contains all components in one repo. If there are many updates we may consider moving each theme to it's own repo. For now, you can inlcude the whole repo into your existing build setup using `npm` and a `package.json`. eg: 

"dependencies": {
    "irnmn-components": "github:ennismore/irnmn-components#<tag-name>"
}


## Usage
The only build script currently is just to run some linting and formatting. You can run `npm run prettier:js` to format all `.js` files. There is also a pre-commit hook that will fire that will lint all files before commiting.

To test a component locally, you need to run a local dev server. A simple approach to this can be just run `npx http-server /path/to/project -o -p 9999` which creates a simple node server you can access the components.

## Deployment
For now, there is no current deployment process. Each component should be pulled into the build process of the site it is being used in. This may change in future.

