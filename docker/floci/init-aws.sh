#!/bin/sh
set -eu

region="${AWS_DEFAULT_REGION:-us-east-1}"
endpoint="${AWS_ENDPOINT_URL:-http://localhost:4566}"
user_pool_id="${region}_amaiback"
client_id="amaiback-local-client"

if ! aws cognito-idp describe-user-pool \
  --user-pool-id "${user_pool_id}" \
  --endpoint-url "${endpoint}" >/dev/null 2>&1; then
  aws cognito-idp create-user-pool \
    --pool-name amaiback-local \
    --username-attributes email \
    --auto-verified-attributes email \
    --policies '{"PasswordPolicy":{"MinimumLength":8,"RequireUppercase":true,"RequireLowercase":true,"RequireNumbers":true,"RequireSymbols":true}}' \
    --user-pool-tags "floci:override-id=${user_pool_id},floci:override-cognito-client-id=use-name" \
    --endpoint-url "${endpoint}" >/dev/null
fi

if ! aws cognito-idp describe-user-pool-client \
  --user-pool-id "${user_pool_id}" \
  --client-id "${client_id}" \
  --endpoint-url "${endpoint}" >/dev/null 2>&1; then
  aws cognito-idp create-user-pool-client \
    --user-pool-id "${user_pool_id}" \
    --client-name "${client_id}" \
    --no-generate-secret \
    --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
    --endpoint-url "${endpoint}" >/dev/null
fi

echo "Cognito local listo en Floci: pool=${user_pool_id}, client=${client_id}"
