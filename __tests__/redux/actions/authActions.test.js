/* eslint-disable no-undef */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import {
  createAccount,
  verifyAccount,
  loggOut,
} from '../../../src/redux/actions/auth.actions';
import SessionStorage from '../../../__mocks__/sessionStorageMock';

const userData = {
  firstName: 'Elie',
  lastName: 'Mugenzi',
  email: 'eliemugenzi@gmail.com',
  username: 'elie',
  password: '123456',
  confirmPassword: '123456',
  dateOfBirth: '01/03/1997',
  bio: 'I am me!',
  gender: 'M',
};

const middleware = [thunk];
const mockStore = configureStore(middleware);

const store = mockStore({});
let storage;
describe('Should make it happen', () => {
  beforeEach(() => {
    moxios.install();
    storage = window.sessionStorage;
    window.sessionStorage = new SessionStorage();
  });
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
    window.sessionStorage = storage;
  });
  test('Let us see if it works', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: {
          data: {
            name: 'Elie',
            email: 'elie@gmail.com',
          },
        },
      });
    });

    return store.dispatch(createAccount(userData)).then(() => {
      expect(store.getActions().length).toEqual(3);
    });
  });
  test('It will throw errors', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: {
          error: 'Invalid request',
        },
      });
    });

    return store.dispatch(createAccount({})).then(() => {
      expect(store.getActions().length).toEqual(2);
    });
  });
  test('Should verify an account', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 202,
        message: 'You are now verified',
      });
    });
    const token = 'dhdhdhdhdhd';
    return store.dispatch(verifyAccount(token)).then(() => {
      expect(store.getActions().length).toEqual(3);
    });
  });
  test('Should not be able to verify an account', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        error: 'Invalid request',
      });
    });
    return store.dispatch(verifyAccount('1234')).then(() => {
      expect(store.getActions().length).toEqual(3);
    });
  });
  test('should be able to log out', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        message: ' you are now logged out',
      });
    });
    return store.dispatch(loggOut()).then(() => {
    });
  });
});
