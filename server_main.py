#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# author: zhanghao04@corp.netease.com
import socketserver
import threading


ADDRESS_TCP = ('0.0.0.0', 9998)  # bind_addr
ADDRESS_UDP = ('0.0.0.0', 9999)  # bind_addr
g_conn_pool = []

class ThreadedTCPRequestHandler(socketserver.StreamRequestHandler):
    def handle(self):
        while True:
            try:
                self.data = self.connection.recv(1024)
                print("TCP message：%s" % (self.client_address,self.data.decode(encoding="utf8")))
                self.connection.send(("already got your message: " + self.data.decode(encoding='utf8')).encode())
            except:  # disconnected
                print("message can not decode, connection disconnected")
                self.connection.close()
                break


class ThreadedUDPRequestHandler(socketserver.DatagramRequestHandler):
    def handle(self):
        # while True:
    # try:
        # self.data, socket = self.request
        # print(self.socket)
        self.data = self.rfile.readline()
        addr = self.client_address
        print(self.data)
        self.socket.sendto(("UDP message: " + self.data.decode(encoding='utf8')).encode(), addr)


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass


class ThreadedUDPServer(socketserver.ThreadingMixIn, socketserver.UDPServer):
    pass


if __name__ == '__main__':
    server = ThreadedTCPServer(ADDRESS_TCP, ThreadedTCPRequestHandler)
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    
    
    server = ThreadedUDPServer(ADDRESS_UDP, ThreadedUDPRequestHandler)
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()

    while True:
        cmd = input("""--------------------------
input 1:now link Num.
input 2:send message to client.
input 3:close server.
""")
        if cmd == '1':
            print("--------------------------")
            print("now link Num：", len(g_conn_pool))
        elif cmd == '2':
            print("--------------------------")
            index, msg = input("input message").split(",")
            g_conn_pool[int(index)].sendall(msg.encode(encoding='utf8'))
        elif cmd == '3':
            exit()