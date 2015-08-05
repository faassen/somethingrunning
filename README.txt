README
------

`actions/worker.js` executes the server action creators synchronously.

The ADD action uses the add URL (hardcoded in the state for now) to send
POST requests to add new objects. Once the object is posted, the result from
the server is an object that contains the server URL in `@id`. This can
then be used for subsequent updates.

The UPDATE action sends POST requests to the `@id` URL of the item. The update
action must be executed after the add action has completed.

In effect, for optimistic actions like ADD and UPDATE, you need *two*
action creator: the optimistic action creator, and the action creator
run by the worker that actually informs the server. The server action
creator dispatches to a SERVER_UPDATE action to inform the reducer
about the information from the server.

The worker needs it own reducer-style switch statement to match
previously executed optimistic actions with the asynchronous server
actions.

Goals:

* see whether we can turn this into reusable middleware.

* get rid of the separate switch statement in `handleActions`. I'd prefer
  to define what server action needs to take place near the optimistic
  action itself.

Idea:

Action creators can return an extra property that contains a function
that knows how to update the server:

```js
export function add(item) {
    return {
        type: types.ADD,
        item: item,
        server: (state, action, dispatch) => {
           ...
        }
    };
}
```

The middleware could then:

* make sure to remove this function from the action before it gets stored
  in the state.

* keep track of the mapping from type to server update functions.

* automatically handling executing server actions.

But it doesn't seem right to map action type to server update
function, as in this design an action creator could return an entirely
different server update function each time it gets executed.
