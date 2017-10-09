/**
 * Utility for creating Redux reducers.
 * @function
 * @param initialState {object} Initial state of the reducer.
 * @param reducers {object} Object containing the reducers, keyed by the action constant.
 */
function createReducer(initialState, reducers) {
  return (state = initialState, action) => {
    const reducer = reducers[action.type];
    return reducer ? reducer(state, action.data) : state;
  };
}

export default createReducer;
