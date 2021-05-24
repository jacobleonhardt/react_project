// Imports
import { csrfFetch } from './csrf';

// Constants
// const dispatch = useDispatch();
const LOGGED_IN = '/session/LOGGED_IN';
const LOGGED_OUT = '/session/LOGGED_OUT';

// Thunks
export const signup = (user) => async (dispatch) => {
  const { username, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setSessionUser(data));
  return response;
};

export const login = (credential) => async (dispatch) => {
  const res = await csrfFetch(`/api/session`, {
    method: 'POST',
    body: JSON.stringify(credential),
  });
  const user = await res.json();
  if (res.ok) {
    dispatch(setSessionUser(user));
  } else {
    throw res;
  }
};

export const edit = (user) => async (dispatch) => {
  const { username, email, password, id } = user;
  let response;
  if (password === '') {
    response = await csrfFetch(`/api/settings`, {
      method: "PATCH",
      body: JSON.stringify({
        username,
        email,
        id
      }),
    });

  } else {
    response = await csrfFetch(`/api/settings`, {
      method: "PUT",
      body: JSON.stringify({
        username,
        email,
        password,
        id
      }),
    });
  }
  const data = await response.json();
  dispatch(setSessionUser(data));
};

export const restore = () => async (dispatch) => {
  const res = await csrfFetch(`/api/session`);
  const user = await res.json();

  dispatch(setSessionUser(user));
  return res;
};

export const logout = () => async (dispatch) => {
  const res = await csrfFetch(`/api/session`, {
    method: 'DELETE',
  });
  dispatch(removeSessionUser());
  return res;
};

// Action Creators
function setSessionUser(user) {
  return {
    type: LOGGED_IN,
    user,
  };
}

function removeSessionUser() {
  return {
    type: LOGGED_OUT
  };
}

// Reducer
// state === session slice of state
export default function sessionReducer(state = {}, action) {
  let newState = {...state};
  console.log('/// NEWSTATE: ', newState)
  switch(action.type) {
        case LOGGED_IN:
          newState['user'] = action.user;
          return newState;
        case LOGGED_OUT:
          newState['user'] = null;
          return newState;
        default:
          return state;
    }
};
