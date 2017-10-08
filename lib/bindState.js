import R from 'ramda';


const lensPath = R.memoize(R.lensPath);

/**
 * Utility for two-way-binding objects in React component state.
 * @function
 * @param thisBind {React.Component} `this` of the component the function is used in.
 * @returns {bindState~innerBind}
 */
export default function bindState(thisBind) {
  function getChangeHandler(path, formatter = R.identity) {
    if (!Array.isArray(path) && typeof path !== 'string') {
      throw new Error('bindState: invalid path!');
    }

    // If path is not an array use it as the key
    if (!Array.isArray(path)) {
      return evt => thisBind.setState({
        [path]: formatter(evt.target.value),
      });
    }

    if (path.length === 0) {
      throw new Error('bindState: invalid path!');
    }

    const head = R.head(path);
    const tail = R.tail(path);

    if (!tail) {
      return evt => thisBind.setState({
        [head]: formatter(evt.target.value),
      });
    }

    const baseLens = R.lensProp(head);
    const pathLens = R.lensPath(tail);
    const base = R.view(baseLens, thisBind.state);

    return evt => thisBind.setState({
      [head]: R.set(pathLens, formatter(evt.target.value), base),
    });
  }

  const getChangeHandlerMemoized = R.memoize(path => getChangeHandler(path));

  /**
   * @function
   * @param path {Array.<string|number>|string} The path in the state to bind to.
   * @param formatter {function} Optional formatter for the input value, for example
   * for numeric fields.
   */
  function innerBind(path, formatter) {
    const lens = lensPath(path);

    if (!formatter) {
      return {
        value: R.view(lens, thisBind.state),
        onChange: getChangeHandlerMemoized(thisBind, path),
      };
    }

    return {
      value: R.view(lens, thisBind.state),
      onChange: getChangeHandler(thisBind, path, formatter),
    };
  }

  return innerBind;
}
