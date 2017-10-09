# City Dev Labs utility library for React and Redux

## Installation

```shell
npm i -S https://github.com/W3GroupFinland/cdl-react-utils
```

## Documentation

Documentation can be found [here](https://github.com/W3GroupFinland/cdl-react-utils/blob/master/DOCS.md).

## Development

Available NPM scripts are:

```shell
npm run lint # Run the linter.

npm run lint:fix # Run the linter and attempt to fix some of the errors automatically.

npm run generate-docs # Re-generate the documentation.

```

**NOTE:** default exports MUST be separate from the lines the exports are defined on; e.g. `export default function createReducer(...` causes the JSDoc generation to not see the function and omits it from the documentation.
