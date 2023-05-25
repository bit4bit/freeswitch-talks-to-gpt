################################
### FreeSwitch headers files found in libfreeswitch-dev ###
# TAKEN FROM: https://github.com/xadhoom/mod_bcg729/blob/master/Makefile
FS_INCLUDES=/usr/include/freeswitch
FS_MODULES=/usr/lib/freeswitch/mod
################################


### END OF CUSTOMIZATION ###
SHELL := /bin/bash
PROC?=$(shell uname -m)
CMAKE := cmake

INCLUDES=-I/usr/include -I$(FS_INCLUDES)
CFLAGS=-fPIC -O3 -fomit-frame-pointer -fno-exceptions -Wall -pedantic $(INCLUDES)
CXXFLAGS= -std=c++11

LDFLAGS=-lm -lwebsockets
SOURCES=mod_audio_fork.c lws_glue.cpp parser.cpp audio_pipe.cpp
OBJS=mod_audio_fork.o lws_glue.o parser.o audio_pipe.o

all : $(OBJS)
	$(CC) $(CFLAGS) -shared -o mod_audio_fork.so $^ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $^ -o $@
%.o: %.cpp
	$(CXX) $(CFLAGS) $(CXXFLAGS) -c $^ -o $@

clean:
	rm -f *.o *.so *.a *.la;

distclean: clean
	rm -fR audio_fork

install: all
	/usr/bin/install -c mod_audio_fork.so $(INSTALL_PREFIX)/$(FS_MODULES)/mod_audio_fork.so
