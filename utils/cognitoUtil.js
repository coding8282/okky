import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

export function createCognitoUserPool() {
    return new CognitoUserPool(process.env.cognitoPool);
}

export function getCurrentCognitoUser() {
    let pool = createCognitoUserPool();
    return pool.getCurrentUser();
}

export function createCognitoUser(Username) {
    let Pool = createCognitoUserPool();
    return new CognitoUser({ Username, Pool });
}