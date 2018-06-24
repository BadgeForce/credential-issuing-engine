#!/usr/bin/env bash
AWS_REGION=us-east-1 \
AWS_ACCESS_KEY_ID=AKIAJ2LAZS3LSXH3C6EQ \
AWS_SECRET_ACCESS_KEY=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 \
lego -a --email="engineering@badgeforce.io" --domains="testnet.badgeforce.io" --dns="route53" --dns-timeout=60 run
# certbot certonly --agree-tos --dns-route53 --email engineering@badgeforce.io -d testnet.badgeforce.io
