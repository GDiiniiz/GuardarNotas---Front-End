import axios from 'axios';
import Constants from 'expo-constants';
import { version } from 'react';
import { Platform } from 'react-native';

export const api = axios.create({
  baseURL: '',
});

api.interceptors.request.use(
  async (config) => {
    config.headers['app-request'] = '1';
    config.headers['app-version'] = version;
    config.headers['app-platform'] = Platform.OS;
    config.headers['app-device'] = Constants.installationId;

    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    // if (error.response.status === 401) {
    //   await AsyncStorage.removeItem('@godtalks:user')
    //   // await AsyncStorage.removeItem('@ccred:app-auth')
    //   await AsyncStorage.removeItem('@godtalks:token-id')
    //   await AsyncStorage.removeItem('@godtalks:token-csrf')
    // }
    return Promise.reject(error);
  }
);
