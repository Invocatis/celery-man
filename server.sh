docker run --rm -p 8080:8080 \
	-v .:/app/:ro \
	-v ./nginx.conf:/etc/nginx/nginx.conf:ro \
	nginx
