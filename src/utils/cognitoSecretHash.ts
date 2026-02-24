import crypto from "crypto";

export const generateSecretHash = (username: string) => {
  const message = username + process.env.COGNITO_CLIENT_ID;
  return crypto
    .createHmac("sha256", process.env.COGNITO_CLIENT_SECRET!)
    .update(message)
    .digest("base64");
};
