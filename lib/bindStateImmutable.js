import R from 'ramda';

/**
 * Utility for two-way-binding Immutable.JS objects in React component state.
 * @function
 * @param thisBind {React.Component} `this` of the component the function is used in.
 * @returns {bindStateImmutable~innerBind}
 */
export default function bindStateImmutable(thisBind) {
  /**
   * @function
   * @param path {Array.<string|number>} The path in the state to bind to.
   * Must be atleast two keys deep.
   * @param formatter {function} Optional formatter for the input value, for example
   * for numeric fields.
   */
  function innerBind(path, formatter = R.identity) {
    // The path must be at least two keys deep.
    if (!Array.isArray(path) || path.length < 2) {
      throw new Error('bindStateImmutable: invalid path!');
    }

    const head = R.head(path);
    const tail = R.tail(path);

    return {
      value: thisBind.state[head].getIn(tail),
      onChange: evt => thisBind.setState({
        [head]: thisBind.state[head].setIn(tail, formatter(evt.target.value)),
      }),
    };
  }

  return innerBind;
}
