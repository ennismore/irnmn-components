# IRNMN Components
This repository contains a collection of web components for use in Irnmn projects.

## Installation
This repo contains all components in one repo. If there are many updates we may consider moving each theme to it's own repo. For now, you can inlcude the whole repo into your existing build setup using `npm` and a `package.json`. eg:

"dependencies": {
    "irnmn-components": "github:ennismore/irnmn-components#v1.1.2"
}

Always include a version number (ie #v1.1.2). For new websites, use the latest Release version number and for existing websites, use the version that's tested with the website and known to work without any issues.

Example:

```bash
npm i https://github.com/ennismore/irnmn-components.git#v1.1.2
```


## Usage
The only build script currently is just to run some linting and formatting. You can run `npm run prettier:js` to format all `.js` files. There is also a pre-commit hook that will fire that will lint all files before committing.

To test a component locally, you need to run a local dev server. A simple approach to this can be just run `npx http-server /path/to/project -o -p 9999` which creates a simple node server you can access the components.

## Local Development - Method 1 
Please use the following steps to install `irnmn-components` and `http-server` :

1. Visit https://github.com/ennismore/irnmn-components and clone the repository anywhere in your local machine.
2. Now use `http-server` via `npx` to install local server for `irnmn-components`. For more go to: https://www.npmjs.com/package/http-server 
3. Navigate to your local directory `irnmn-components` and run: `http-server --cors`
4. If the installation was correct the server will start and you'll get two available url's-ports. You can use the one that start with 127. Navigate to: `import 'http://127.0.0.1:8080/` to test.
5. Now you have your web component server running you need to import the file you are working on to your project. Let's say you are working on a calendar task. Navigate to the your local server and go to calendar and then click to the index.js file. Your url should look like this: `'http://127.0.0.1:8080/calendar/index.js` Copy that url.
6. Now you have copied the url you want to go to the project you are working on, for example: delano, hoxton etc. and find the main js file where all imports are located. This file should called index.js or main.js. Open the file and find web components and replace the following line:

`import 'irnmn-components/calendar';` with `import 'http://127.0.0.1:8080/calendar/index.js';`

I'm using calendar as an example but it can be any web component.

7. That's it you are all set. Final step is to run npm start on your project and use console.log to your web component file to test if it's working correct.

8. After you finish working and testing don't forget to replace your project's web component import as it was before: `import 'irnmn-components/calendar';` We don't want to commit an import with the local server url.

9. This is it, after you finish testing you web component please read the Deployment documentation to make a release with your new changes and version. 


## Local Development - Method 2 
If the above method fails because of http VS https you can use `npm link` to link the irnmn-components repo on your local with the child theme you are working on.

1. Go to your local directory of `irnmn-components` and run `npm link`
2. Now go to your local child theme directory and run `npm link`
3. Now your child theme should be linked with your local irnmn-components folder

Do not forget to run `npm unlink` for future dev work to prevent package.json to read the local directory of `irnmn-components`

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
