import {Action, Middleware, MiddlewareAPI, UnknownAction} from "redux";
import {RootState} from "../store";
import {ThunkDispatch} from "redux-thunk";
import {ordersSlice} from "../reducers/orders";
import {FeedResponse} from "../reducers/orders"
import {refreshToken} from "../../common/refreshToken";
import {getAccessToken} from "../../common/getAuthCookie";

export type AppDispatch = ThunkDispatch<RootState, any, Action>

export const socketMiddleware = (wsUrl: string): Middleware => {
    return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
        let socket: WebSocket | null = null;
        const {actions} = ordersSlice

        return next => (action: UnknownAction) => {
            const { dispatch } = store;

            if (action.type === actions.wsConnectionStart.type) {
                socket = new WebSocket(`${wsUrl}${action.payload}`);
                socket.onopen = _ => {
                    dispatch(actions.wsConnectionSuccess());
                };
            }

            if (socket) {
                socket.onerror = event => {
                    dispatch(actions.wsConnectionError(event));
                };

                socket.onmessage = event => {
                    const feed: FeedResponse = JSON.parse(event.data);
                    if (feed.message === 'Invalid or missing token') {
                        refreshToken().then(_ => {
                            const accessToken = getAccessToken()
                            socket = new WebSocket(`${wsUrl}?token=${accessToken}`);
                            socket.onopen = _ => {
                                dispatch(actions.wsConnectionSuccess());
                            };
                        })
                    }
                    dispatch(actions.wsGetMessage(feed));
                };

                socket.onclose = _ => {
                    dispatch(actions.wsConnectionClosed());
                    socket = null;
                };
            }

            next(action);
        };
    }) as Middleware;
};