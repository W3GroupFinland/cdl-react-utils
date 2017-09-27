import R from 'ramda';
import { isImmutable } from 'immutable';

/**
 * Utility for two-way-binding objects in React component state.
 * @function
 * @param thisBind {React.Component} `this` of the component the function is used in.
 * @returns {bindState~innerBind}
 */
export function bindState(thisBind) {
  /**
   * @function
   * @param path {Array.<string|number>|string} The path in the state to bind to.
   * @param formatter {function} Optional formatter for the input value, for example
   * for numeric fields.
   */
  function innerBind(path, formatter = R.identity) {
    if (!Array.isArray(path) && typeof path !== 'string') {
      throw new Error('bindState: invalid path!');
    }

    // If path is not an array use it as the key
    if (!Array.isArray(path)) {
      return {
        value: this.state[path],
        onChange: evt => this.setState({
          [path]: evt.target.value,
        }),
      };
    }

    if (path.length === 0) {
      throw new Error('bindState: invalid path!');
    }

    const head = R.head(path);
    const tail = R.tail(path);

    if (!tail) {
      return {
        value: this.state[head],
        onChange: evt => this.setState({
          [head]: evt.target.value,
        }),
      };
    }

    const lens = R.lensPath(path);
    const baseLens = R.lensProp(head);
    const pathLens = R.lensPath(tail);

    const base = R.view(baseLens, this.state);
    return {
      value: R.view(lens, this.state),
      onChange: evt => this.setState({
        [head]: R.set(pathLens, formatter(evt.target.value), base),
      }),
    };
  }

  return innerBind.bind(thisBind);
}


/**
 * Utility for two-way-binding Immutable.JS objects in React component state.
 * @function
 * @param thisBind {React.Component} `this` of the component the function is used in.
 * @returns {bindStateImmutable~innerBind}
 */
export function bindStateImmutable(thisBind) {
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

    if (!isImmutable(this.state[head])) {
      throw new Error(`bindStateImmutable: state property pointed by the head of the given path (\`this.state.${head}\`)  is not an immutable object!`);
    }

    return {
      value: this.state[head].getIn(tail),
      onChange: evt => this.setState({
        [head]: this.state[head].setIn(tail, formatter(evt.target.value)),
      }),
    };
  }

  return innerBind.bind(thisBind);
}

/**
 * Utility for creating Redux reducers.
 * @function
 * @param initialState {object} Initial state of the reducer.
 * @param reducers {object} Object containing the reducers, keyed by the action constant.
 */
export function createReducer(initialState, reducers) {
  return (state = initialState, action) => {
    const reducer = reducers[action.type];
    return reducer ? reducer(state, action.data) : state;
  };
}
