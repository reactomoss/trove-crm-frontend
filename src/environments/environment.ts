// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAxIWcCA6BhngwYB-JuSleua4GaU6Tm_6Y",
    authDomain: "trove-crm.firebaseapp.com",
    projectId: "trove-crm",
    storageBucket: "trove-crm.appspot.com",
    messagingSenderId: "287909577050",
    appId: "1:287909577050:web:ebc04308247c94620fb363"
  },
  envName: 'Development',
  baseUrl: 'https://ct.trovecrm.in/api/v1/', //http://127.0.0.1:8000/api/v1/ | https://ct.trovecrm.in/api/v1/

  /** API Methods */
  /*======= Account ====================*/
  register: 'account/register',
  login: 'account/login',
  me: 'account/me',
  sendPasswordResetLink: 'account/sendPasswordResetLink',
  resetPassword: 'account/resetPassword',
  validateResetPasswordToken: 'account/validateResetPasswordToken',
  verifyEmail: 'account/verifyEmail',
  logout: 'account/logout',
  /*======= Settings ====================*/
  profile: 'settings/profile',
  profile_picture: 'settings/profile-picture',
  changePassword: 'settings/change-password',
  preference: 'settings/preference',
  users: 'settings/users',
  listusers: 'settings/users/index',
  roles: 'settings/roles',
  listroles: 'settings/roles/index',
  notifications: 'settings/notifications',
  pipelines: 'settings/pipeline',
  company: 'organizations',
  leads: 'leads',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
