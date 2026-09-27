import http.server
import os
import sys

PORT = 8000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Determine filesystem path for requested URL
        path = self.translate_path(self.path)
        # If requested path does not exist and is not a direct file with an extension, fallback to /index.html
        if not os.path.exists(path) and "." not in os.path.basename(self.path):
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    handler = SPAHandler
    # Use ThreadingHTTPServer for dual IPv4/IPv6 support and concurrent request handling
    server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print(f"Serving SPA HTTP server on 0.0.0.0:{PORT}...")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
