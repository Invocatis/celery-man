state="$PWD/.https"
port="${HTTPS_PORT:-8443}"

mkdir -p "$state/certs" $"state/logs"

if [[ ! -f "state/certs/localhost.pem" ]]; then
    mkcert \
        -cert-file "$state/certs/localhost.pem" \
        -key-file "$state/certs/localhost-key.pem" \
        localhost 127.0.0.1 ::1
fi

docker run --rm -p 443:443 \
	-v .:/app/:ro \
	-v ./nginx.conf:/etc/nginx/nginx.conf:ro \
	-v ./.https/certs:/etc/nginx/certs \
	nginx
