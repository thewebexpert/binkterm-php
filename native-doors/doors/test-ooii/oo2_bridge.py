#!/usr/bin/env python3
"""
TEST OOII Native Door Bridge
Connects the native door PTY environment to the local door-server RLogin daemon.
Allows direct comparison of ANSI, input latency, and terminal performance vs raw RLogin.
"""

import sys
import os
import socket
import select
import termios
import tty

def main():
    dropfile = sys.argv[1] if len(sys.argv) > 1 else ''
    user_num = sys.argv[2] if len(sys.argv) > 2 else '1'
    username = 'TheWebExpert'

    # Extract user name from DOOR.SYS dropfile if available
    if dropfile and os.path.isfile(dropfile):
        try:
            with open(dropfile, 'r', encoding='latin1', errors='ignore') as f:
                lines = [line.strip() for line in f.readlines()]
                # Line 10 (0-indexed 9) is User Real Name / Handle in DOOR.SYS
                if len(lines) >= 10 and lines[9]:
                    username = lines[9]
                # Line 36 (0-indexed 35) is User Alias
                elif len(lines) >= 36 and lines[35]:
                    username = lines[35]
        except Exception:
            pass

    host = os.environ.get('OO2_HOST', 'door-server')
    port = int(os.environ.get('OO2_PORT', '513'))
    server_user = 'OO2'
    term_type = 'ansi/38400'

    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((host, port))
        s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

        # RFC 1282 RLogin Handshake: \0 clientUsername \0 serverUsername \0 termString \0
        handshake = (
            b'\x00' +
            username.encode('latin1', errors='ignore') + b'\x00' +
            server_user.encode('ascii') + b'\x00' +
            term_type.encode('ascii') + b'\x00'
        )
        s.sendall(handshake)

        # Server sends a single \x00 ACK byte
        ack = s.recv(1)
        if ack and ack != b'\x00':
            sys.stdout.buffer.write(ack)
            sys.stdout.buffer.flush()

        old_settings = None
        if sys.stdin.isatty():
            try:
                old_settings = termios.tcgetattr(sys.stdin.fileno())
                tty.setraw(sys.stdin.fileno())
            except Exception:
                pass

        try:
            stdin_fd = sys.stdin.fileno()
            sock_fd = s.fileno()

            while True:
                rlist, _, _ = select.select([stdin_fd, sock_fd], [], [])
                if stdin_fd in rlist:
                    data = os.read(stdin_fd, 1024)
                    if not data:
                        break
                    s.sendall(data)

                if sock_fd in rlist:
                    data = s.recv(4096)
                    if not data:
                        break
                    sys.stdout.buffer.write(data)
                    sys.stdout.buffer.flush()
        finally:
            if old_settings is not None:
                termios.tcsetattr(sys.stdin.fileno(), termios.TCSADRAIN, old_settings)
            s.close()
    except Exception as e:
        sys.stderr.write(f"\r\n[TEST OOII] Connection error: {e}\r\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
