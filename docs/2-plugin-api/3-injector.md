<!--
  Copyright (c) 2020-2021 aetheryx & Cynthia K. Rey
  This work is licensed under a Creative Commons Attribution-NoDerivatives 4.0 International License.
  https://creativecommons.org/licenses/by-nd/4.0
-->

# Injector
Powercord's injector lets you inject into a module's method and run custom logic. It's one of the most powerful modding
tools, yet not a complex tool at all: it's very easy to understand it and start using it in your plugins.

*But why a specific module for that? I can just reassign the function and call it a day?*<br>
**No**. Doing so would cause severe issues with compatibilities with other plugins. There are no viable way of removing
your injection without wiping the injections done later on, and your plugin could accidentally hide away some properties
plugins need, mask the function signature, and you won't benefit from our built-in error handling.

## Module
```js
import { inject, uninject } from '@powercord/injector'
// In DevTools: PowercordInjector.inject, PowercordInjector.uninject
```

## Injecting
###### `inject` signature
```js
inject(id, mdl, method, fn [, before])
```
| Parameter | Type | Description |
|---|---|---|
| id | string | The injection ID. Must be unique within your plugin, can be used to [uninject](#uninject) and will show up in logs. |
| mdl | object | The module containing the function you want to inject into. |
| method | string | The name of the function you want to inject into. Must be a member of the module you passed, otherwise a TypeError will be raised. |
| fn | function | The function you want to inject. See [injected function behavior](#injected-function-behavior) for more details. |
| before | boolean | Optional, default `false`. Whether the injection should run before Discord's original code or not. |

>info
> Powercord will automatically cleanup the injections you've done when unloading your plugin, so you don't need to
> manually uninject. It's still possible to do it at runtime, if you need to.

### Injected function behavior
<!-- todo: write stuff -->

#### Injecting before Discord
<!-- todo: write stuff -->
<!-- change args, abort execution & return -->

### Injecting & Async
ES6' `async/await` makes working with asynchronous tasks a breeze, and they are super easy to use. However, just like
everything in JS, there is a pitfall due to the logic behind it.

When making a function `async`, what happens behind the scene is that the engine wraps everything in a classic `Promise`
object. However, this means if you hoped to use `async` in your injected function, those hopes will only remain hopes
that'll never see the light of the day. Your function will cause Discord to receive a `Promise`, and everything will
blow up.

Unfortunately, there are cases where you won't end up with a magic recipe to get asynchronous code to run. For those
cases, you'll have to get creative and find your way through. The only easy one is React components, since it doesn't
differ from the classic React workflow.

For React components, you simply need to wrap stuff in a full React component, where you can use the `useEffect` hook
(or the `componentDidMount` lifecycle method, if you're using class components). That way, you'll be able to run
asynchronous tasks and re-render when your async task is done.

## Uninjecting
To uninject, you simply call the `uninject` function with the ID you used to inject previously. Attempting to uninject
using an invalid ID will simply have no effect and will not raise an error.

###### `uninject` signature
```js
uninject(id)
```