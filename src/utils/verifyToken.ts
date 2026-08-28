import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const region = process.env.COGNITO_REGION;
const userPoolId = process.env.COGNITO_USER_POOL_ID;
const issuer =
  process.env.COGNITO_ISSUER ||
  `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

const client = jwksClient({
  jwksUri:
    process.env.COGNITO_JWKS_URI || `${issuer}/.well-known/jwks.json`,
});

function getKey(header: JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid!, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        issuer,
        algorithms: ["RS256"],
      },
      (err, decoded: any) => {
        if (err) return reject(err);

        if (decoded.token_use !== "access") {
          return reject(new Error("Invalid token use"));
        }

        if (decoded.client_id !== process.env.COGNITO_CLIENT_ID) {
          return reject(new Error("Invalid client"));
        }

        resolve(decoded);
      },
    );
  });
};
