import { generateSecretHash } from "@utils/cognitoSecretHash";
import {
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  GlobalSignOutCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
  endpoint: process.env.COGNITO_ENDPOINT,
  credentials: process.env.COGNITO_ENDPOINT
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
      }
    : undefined,
});

const secretHash = (username: string) =>
  process.env.COGNITO_CLIENT_SECRET
    ? generateSecretHash(username)
    : undefined;

const secretHashAuthParameter = (
  username: string,
): Record<string, string> => {
  const hash = secretHash(username);
  return hash ? { SECRET_HASH: hash } : {};
};

export const registerUser = async (email: string, password: string) => {
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    SecretHash: secretHash(email),
    UserAttributes: [{ Name: "email", Value: email }],
  });

  return client.send(command);
};

export const confirmUser = async (email: string, code: string) => {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: email,
    ConfirmationCode: code,
    SecretHash: secretHash(email),
  });

  return client.send(command);
};

export const loginUser = async (email: string, password: string) => {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: process.env.COGNITO_CLIENT_ID!,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      ...secretHashAuthParameter(email),
    },
  });

  const response = await client.send(command);

  return {
    accessToken: response.AuthenticationResult?.AccessToken,
    idToken: response.AuthenticationResult?.IdToken,
    refreshToken: response.AuthenticationResult?.RefreshToken,
  };
};

export const refreshSession = async (
  username: string,
  refreshToken: string,
) => {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: process.env.COGNITO_CLIENT_ID!,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
      ...secretHashAuthParameter(username),
    },
  });

  const response = await client.send(command);

  return {
    accessToken: response.AuthenticationResult?.AccessToken,
    idToken: response.AuthenticationResult?.IdToken,
  };
};

export const logoutUser = async (accessToken: string) => {
  const command = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });

  await client.send(command);
  return true;
};

export const forgotPassword = async (email: string) => {
  const command = new ForgotPasswordCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: email,
    SecretHash: secretHash(email),
  });

  return client.send(command);
};

export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
    SecretHash: secretHash(email),
  });

  return client.send(command);
};
