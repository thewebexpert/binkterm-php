#!/bin/bash
KEY="/var/www/html/data/barons_key"

if [ ! -f "$KEY" ]; then
    ssh-keygen -t ed25519 -N "" -f "$KEY" -q
fi
chmod 600 "$KEY" 2>/dev/null || true

exec /usr/bin/ssh -o StrictHostKeyChecking=no \
                 -o UserKnownHostsFile=/dev/null \
                 -o LogLevel=ERROR \
                 -i "$KEY" \
                 -p 2222 \
                 "barons@85.119.83.118"
