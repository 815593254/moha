"""
python version of plus1s
"""

from __future__ import print_function, unicode_literals
import time

try:
    from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
except ImportError:
    from http.server import HTTPServer, BaseHTTPRequestHandler



MAX_FRAMES = 360
frames = []

class Plus1sHTTPRequestHandler(BaseHTTPRequestHandler):
    
    def redirect_to_github(self):
        '''
        https://github.com/HFO4/plus1s.live
        '''
        self.send_response(302)
        self.send_header('Location', 'https://github.com/HFO4/plus1s.live')
        self.end_headers()

    def write_frame(self, frame):
        self.wfile.write(frame)
        self.wfile.write(b'\033[2J\033[H')
        time.sleep(0.1)
        self.wfile.flush()

    def do_GET(self):
        useragent = self.headers.get('User-Agent', '')
        if 'curl' not in useragent:
            self.redirect_to_github()
            return
        
        loop = 0

        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()

        while True:
            for frame in frames:
                self.write_frame(frame)
            loop += 1
            if loop > 20:
                self.write_frame(b"You've waste too much time, we have to stop you.")
                break

def prepare():
    print('Prepare frames...')
    for i in range(MAX_FRAMES):
        filename = 'pic/{0:03}.txt'.format(i + 1)
        with open(filename, 'rb') as fp:
            frames.append(fp.read())
    print('Frames are ready.')


def main():
    prepare()
    print('Ready to start server')
    server_address = ('', 1926)
    server = HTTPServer(server_address, Plus1sHTTPRequestHandler)
    server.serve_forever()

main()