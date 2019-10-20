/var/log/unifi/*.log {
    rotate 7
    daily
    missingok
    notifempty
    delaycompress
    compress
    copytruncate
}
