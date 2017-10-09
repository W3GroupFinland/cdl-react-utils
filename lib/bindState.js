import R from 'ramda';

const lensPath = R.memoize(R.lensPath);

/**
 * Utility for two-way-binding objects in React component state.
 * @param thisBind {React.Component} - `this` of the component the function is used in.
 * @returns {bindState~innerBind}
 */
function bindState(thisBind) {
  function createChangeHandler(path, formatter = R.identity) {
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

    return (evt) => {
      const baseLens = R.lensProp(head);
      const pathLens = lensPath(tail);
      const base = R.view(baseLens, thisBind.state);

      thisBind.setState({
        [head]: R.set(pathLens, formatter(evt.target.value), base),
      });
    };
  }

  const createChangeHandlerMemoized = R.memoize(path => createChangeHandler(path));

  /**
   * @param path {Array.<string|number>|string} The path in the state to bind to.
   * @param formatter {function} Optional formatter for the input value, for example
   * for numeric fields.
   */
  function innerBind(path, formatter) {
    const lens = lensPath(path);

    if (typeof formatter !== 'function') {
      return {
        value: R.view(lens, thisBind.state),
        onChange: createChangeHandlerMemoized(path),
      };
    }

    return {
      value: R.view(lens, thisBind.state),
      onChange: createChangeHandler(path, formatter),
    };
  }

  return innerBind;
}

export default bindState;
