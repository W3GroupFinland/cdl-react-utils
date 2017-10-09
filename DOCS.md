## Functions

<dl>
<dt><a href="#bindState">bindState(thisBind)</a> ⇒ <code><a href="#bindState..innerBind">innerBind</a></code></dt>
<dd><p>Utility for two-way-binding objects in React component state.</p>
</dd>
<dt><a href="#bindStateImmutable">bindStateImmutable(thisBind)</a> ⇒ <code><a href="#bindStateImmutable..innerBind">innerBind</a></code></dt>
<dd><p>Utility for two-way-binding Immutable.JS objects in React component state.</p>
</dd>
<dt><a href="#createBoundInput">createBoundInput(thisBind)</a> ⇒ <code><a href="#createBoundInput..BoundInput">BoundInput</a></code></dt>
<dd><p>Creates the BoundInput component.</p>
</dd>
<dt><a href="#createReducer">createReducer(initialState, reducers)</a></dt>
<dd><p>Utility for creating Redux reducers.</p>
</dd>
</dl>

<a name="bindState"></a>

## bindState(thisBind) ⇒ [<code>innerBind</code>](#bindState..innerBind)
Utility for two-way-binding objects in React component state.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| thisBind | <code>React.Component</code> | `this` of the component the function is used in. |

<a name="bindState..innerBind"></a>

### bindState~innerBind(path, formatter)
**Kind**: inner method of [<code>bindState</code>](#bindState)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;(string\|number)&gt;</code> \| <code>string</code> | The path in the state to bind to. |
| formatter | <code>function</code> | Optional formatter for the input value, for example for numeric fields. |

<a name="bindStateImmutable"></a>

## bindStateImmutable(thisBind) ⇒ [<code>innerBind</code>](#bindStateImmutable..innerBind)
Utility for two-way-binding Immutable.JS objects in React component state.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| thisBind | <code>React.Component</code> | `this` of the component the function is used in. |

<a name="bindStateImmutable..innerBind"></a>

### bindStateImmutable~innerBind(path, formatter)
**Kind**: inner method of [<code>bindStateImmutable</code>](#bindStateImmutable)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;(string\|number)&gt;</code> | The path in the state to bind to. Must be atleast two keys deep. |
| formatter | <code>function</code> | Optional formatter for the input value, for example for numeric fields. |

<a name="createBoundInput"></a>

## createBoundInput(thisBind) ⇒ [<code>BoundInput</code>](#createBoundInput..BoundInput)
Creates the BoundInput component.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| thisBind | <code>React.Component</code> | `this` of the component the function is used in. |

<a name="createBoundInput..BoundInput"></a>

### createBoundInput~BoundInput(type, path, formatter, immutable, boolean)
The main BoundInput component.

**Kind**: inner method of [<code>createBoundInput</code>](#createBoundInput)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Type of the input, including select which allows you to embed the options used as children. |
| path | <code>Array</code> \| <code>string</code> | The path in the state to bind to. |
| formatter | <code>function</code> | Optional formatter for the input value, for example for numeric fields. Cannot be used with checkboxes. |
| immutable | <code>boolean</code> | Flag to tell the BoundInput component if the state uses Immutable.JS containers as part of its state. Defaults to false. |
| boolean | <code>boolean</code> | Switches between boolean/value mode in checkboxes. No-op if used with other input types (for now, atleas). Defaults to false. |

<a name="createReducer"></a>

## createReducer(initialState, reducers)
Utility for creating Redux reducers.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| initialState | <code>object</code> | Initial state of the reducer. |
| reducers | <code>object</code> | Object containing the reducers, keyed by the action constant. |

