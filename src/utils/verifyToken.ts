import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
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
        issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
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
