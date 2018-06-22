import {CognitoUser, CognitoUserPool} from "amazon-cognito-identity-js";

export function getCurrentCognitoUser() {
  let pool = new CognitoUserPool(process.env.cognitoPool);
  return pool.getCurrentUser();
}

export function createCognitoUser(Username) {
  let Pool = new CognitoUserPool(process.env.cognitoPool);
  return new CognitoUser({Username, Pool});
}
