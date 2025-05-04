import {Action, Middleware, MiddlewareAPI} from "redux";
import {RootState} from "../store";
import {ThunkDispatch} from "redux-thunk";
import {ordersSlice} from "../reducers/orders";

export type AppDispatch = ThunkDispatch<RootState, any, Action>

export const socketMiddleware = (wsUrl: string): Middleware => {
    return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
        let socket: WebSocket | null = null;
        const {actions} = ordersSlice

        return next => (action: any) => {
            const { dispatch } = store;

            socket = new WebSocket(wsUrl);

            if (action.type === 'WS_CONNECTION_START' && !socket) {
                socket = new WebSocket(wsUrl);

                socket.onopen = event => {
                    dispatch(actions.wsConnectionSuccess(event));
                };

                socket.onerror = event => {
                    dispatch(actions.wsConnectionError(event));
                };

                socket.onmessage = event => {
                    const { data } = event;
                    dispatch(actions.wsGetMessage(data));
                };

                socket.onclose = event => {
                    dispatch(actions.wsConnectionClosed(event));
                    socket = null;
                };
            }

            next(action);
        };
    }) as Middleware;
};