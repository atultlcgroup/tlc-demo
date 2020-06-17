FTP.prototype._pasvConnect = function(ip, port, cb) {
    var self = this,
        socket = new Socket(),
        sockerr,
        timedOut = false,
        timer = setTimeout(function() {
          timedOut = true;
          socket.destroy();
          cb(new Error('Timed out while making data connection'));
        }, this.options.pasvTimeout);
  
    socket.setTimeout(0);
    socket.once('connect', function() {
      if (self.options.secure === true) {
        socket = tls.connect({
          socket: socket,
          session: self._socket.getSession() // re-use existing session
        });
        socket.setTimeout(0);
      }
      clearTimeout(timer);
      self._pasvSocket = socket;
      cb(undefined, socket);
    });
    socket.once('error', function(err) {
      sockerr = err;
    });
    socket.once('end', function() {
      clearTimeout(timer);
    });
    socket.once('close', function(had_err) {
      clearTimeout(timer);
      if (!self._pasvSocket && !timedOut) {
        var errmsg = 'Unable to make data connection';
        if (sockerr) {
          errmsg += ': ' + sockerr;
          sockerr = undefined;
        }
        cb(new Error(errmsg));
      }
      self._pasvSocket = undefined;
    });
    socket.connect(port, ip);
  };
  FTP.prototype._store = function(cmd, input, zcomp, cb) {
    var isBuffer = Buffer.isBuffer(input);
    if (!isBuffer && input.pause !== undefined)
      input.pause();
    if (typeof zcomp === 'function') {
      cb = zcomp;
      zcomp = false;
    }
    var self = this;
    this._pasv(function(err, sock) {
      if (err)
        return cb(err);
      if (self._queue[0] && self._queue[0].cmd === 'ABOR') {
        sock.destroy();
        return cb();
      }
      var sockerr, dest = sock;
      sock.once('error', function(err) {
        sockerr = err;
      });
      if (zcomp) {
        self._send('MODE Z', function(err, text, code) {
          if (err) {
            sock.destroy();
            return cb(makeError('Compression not supported', code));
          }
          // draft-preston-ftpext-deflate-04 says min of 8 should be supported
          dest = zlib.createDeflate({ level: 8 });
          dest.pipe(sock);
          sendStore();
        });
      } else
        sendStore();
      function sendStore() {
        // this callback will be executed multiple times, the first is when server
        // replies with 150, then a final reply after the data connection closes
        // to indicate whether the transfer was actually a success or not
        self._send(cmd, function(err, text, code) {
          if (sockerr || err) {
            if (zcomp) {
              self._send('MODE S', function() {
                cb(sockerr || err);
              }, true);
            } else
              cb(sockerr || err);
            return;
          }
          if (code === 150) {
            if (isBuffer)
              dest.end(input);
            else if (typeof input === 'string') {
              // check if input is a file path or just string data to store
              fs.stat(input, function(err, stats) {
                if (err)
                  dest.end(input);
                else
                  fs.createReadStream(input).pipe(dest);
              });
            } else {
              input.pipe(dest);
              input.resume();
            }
          } else {
            if (zcomp)
              self._send('MODE S', cb, true);
            else
              cb();
          }
        });
      }
    });
  };
  FTP.prototype._send = function(cmd, cb, promote) {
    if (cmd !== undefined) {
      if (promote)
        this._queue.unshift({ cmd: cmd, cb: cb });
      else
        this._queue.push({ cmd: cmd, cb: cb });
    }
    if (!this._curReq && this._queue.length) {
      this._curReq = this._queue.shift();
      if (this._curReq.cmd === 'ABOR' && this._pasvSocket)
        this._pasvSocket.aborting = true;
      this._socket.write(this._curReq.cmd);
      this._socket.write(bytesCRLF);
    }
  };
  FTP.prototype._reset = function() {
    if (this._socket && this._socket.writable)
      this._socket.end();
    if (this._socket && this._socket.connTimer)
      clearTimeout(this._socket.connTimer);
    if (this._socket && this._socket.keepalive)
      clearInterval(this._socket.keepalive);
    this._socket = undefined;
    this._pasvSock = undefined;
    this._feat = undefined;
    this._curReq = undefined;
    this._secstate = undefined;
    this._queue = [];
    this._buffer = '';
    this.options.host = this.options.port = this.options.user
                      = this.options.password = this.options.secure
                      = this.options.connTimeout = this.options.pasvTimeout
                      = this.options.keepalive = this._debug = undefined;
    this.connected = false;
  };
  // Utility functions
  function parseListEntry(line) {
    var ret,
        info,
        month,
        day,
        year,
        hour,
        mins;
    if (ret = XRegExp.exec(line, reXListUnix)) {
      info = {
        type: ret.type,
        name: undefined,
        target: undefined,
        rights: {
          user: ret.permission.substr(0, 3).replace(/\-/g, ''),
          group: ret.permission.substr(3, 3).replace(/\-/g, ''),
          other: ret.permission.substr(6, 3).replace(/\-/g, '')
        },
        owner: ret.owner,
        group: ret.group,
        size: parseInt(ret.size, 10),
        date: undefined
      };
      if (ret.month1 !== undefined) {
        month = parseInt(MONTHS[ret.month1.toLowerCase()], 10);
        day = parseInt(ret.date1, 10);
        year = (new Date()).getFullYear();
        hour = parseInt(ret.hour, 10);
        mins = parseInt(ret.minute, 10);
        if (month < 10)
          month = '0' + month;
        if (day < 10)
          day = '0' + day;
        if (hour < 10)
          hour = '0' + hour;
        if (mins < 10)
          mins = '0' + mins;
        info.date = new Date(year + '-' + month + '-' + day
                             + 'T' + hour + ':' + mins);
      } else if (ret.month2 !== undefined) {
        month = parseInt(MONTHS[ret.month2.toLowerCase()], 10);
        day = parseInt(ret.date2, 10);
        year = parseInt(ret.year, 10);
        if (month < 10)
          month = '0' + month;
        if (day < 10)
          day = '0' + day;
        info.date = new Date(year + '-' + month + '-' + day);
      }
      if (ret.type === 'l') {
        var pos = ret.name.indexOf(' -> ');
        info.name = ret.name.substring(0, pos);
        info.target = ret.name.substring(pos+4);
      } else
        info.name = ret.name;
      ret = info;
    } else if (ret = XRegExp.exec(line, reXListMSDOS)) {
      info = {
        name: ret.name,
        type: (ret.isdir ? 'd' : '-'),
        size: (ret.isdir ? 0 : parseInt(ret.size, 10)),
        date: undefined,
      };
      month = parseInt(ret.month, 10),
      day = parseInt(ret.date, 10),
      year = parseInt(ret.year, 10),
      hour = parseInt(ret.hour, 10),
      mins = parseInt(ret.minute, 10);
      if (ret.ampm[0].toLowerCase() === 'p' && hour < 12)
        hour += 12;
      else if (ret.ampm[0].toLowerCase() === 'a' && hour === 12)
        hour = 0;
      if (month < 10)
        month = '0' + month;
      if (day < 10)
        day = '0' + day;
      if (hour < 10)
        hour = '0' + hour;
      if (mins < 10)
        mins = '0' + mins;
      info.date = new Date(year + '-' + month + '-' + day
                           + 'T' + hour + ':' + mins);
      ret = info;
    } else
      ret = line; // could not parse, so at least give the end user a chance to
                  // look at the raw listing themselves
    return ret;
  }
  function makeError(msg, code) {
    var err = new Error(msg);
    err.code = code;
    return err
}