import { EncryptionTransformer } from "typeorm-encrypted";

const encryptionOptions = {
  key: process.env.ENCRYPTION_KEY || "tu-clave-secreta-de-32-caracteres!!!",
  algorithm: "aes-256-cbc" as const,
  ivLength: 16,
  iv: process.env.ENCRYPTION_IV || "iv-16-bytes.",
};

export const EncryptionTransformerInstance = new EncryptionTransformer(
  encryptionOptions,
);
