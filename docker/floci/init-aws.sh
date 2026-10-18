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

bucket="${S3_BUCKET:-amaiback-plant-images}"

if ! aws s3api head-bucket --bucket "${bucket}" \
  --endpoint-url "${endpoint}" >/dev/null 2>&1; then
  aws s3 mb "s3://${bucket}" --region "${region}" \
    --endpoint-url "${endpoint}" >/dev/null
fi

# Public read access only for the plant catalog images in this local bucket.
aws s3api put-public-access-block --bucket "${bucket}" \
  --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false' \
  --endpoint-url "${endpoint}"
aws s3api put-bucket-policy --bucket "${bucket}" \
  --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::${bucket}/plants/*\"}]}" \
  --endpoint-url "${endpoint}"

# Preserve existing objects: sync deliberately does not use --delete.
aws s3 sync /opt/plant-images/ "s3://${bucket}/plants/" \
  --exclude "*" --include "*.png" --include "*.jpg" --include "*.jpeg" \
  --include "*.webp" --include "*.gif" --include "*.avif" \
  --endpoint-url "${endpoint}"

echo "S3 local listo en Floci: bucket=${bucket}, prefijo=plants/"
