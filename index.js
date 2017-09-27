import R from 'ramda';
import { isImmutable } from 'immutable';

export function bindState(thisBind) {
  return (function innerBind(path, formatter = R.identity) {
    // If path is not an array use it as the key
    if (!Array.isArray(path)) {
      return {
        value: this.state[path],
        onChange: evt => this.setState({
          [path]: evt.target.value,
        }),
      };
    }

    const head = R.head(path);
    const tail = R.tail(path);

    if (!head) {
      throw new Error('bindState: invalid path!');
    }

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
  }).bind(thisBind);
}

export function bindStateImmutable(thisBind) {
  return (function innerBind(path, formatter = R.identity) {
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
  }).bind(thisBind);
}

export function createReducer(initialState, reducers) {
  return (state = initialState, action) => {
    const reducer = reducers[action.type];
    return reducer ? reducer(state, action.data) : state;
  };
}
