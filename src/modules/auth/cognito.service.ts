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
});

export const registerUser = async (email: string, password: string) => {
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    SecretHash: generateSecretHash(email),
    UserAttributes: [{ Name: "email", Value: email }],
  });

  return client.send(command);
};

export const confirmUser = async (email: string, code: string) => {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: email,
    ConfirmationCode: code,
    SecretHash: generateSecretHash(email),
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
      SECRET_HASH: generateSecretHash(email),
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
      SECRET_HASH: generateSecretHash(username),
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
    SecretHash: generateSecretHash(email),
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
    SecretHash: generateSecretHash(email),
  });

  return client.send(command);
};
