asunder
========
A small library useful for splitting apart callbacks by their arguments.  
  
Supports node.js `require`, AMD `define`, or no module loader at all (in the browser).

Install
-------
```
npm install asunder
```

Example
-------
```javascript
var a = require('asunder');
var fs = require('fs');

fs.readFile('./node_modules/asunder.js', a.split(onError, onData));

function onError(err) {
  // oh noes
}

function onData(data) {
  // oh yiss
}

// This will print 1 2 3 4 5 to the console (with newlines between)
[1,2,3,4,5].forEach(a.farg(console.log, console));

// This will print 0 1 2 3 4 to the console (with newlines between).
[1,2,3,4,5].forEach(a.sarg(console.log, console));

// This will print the entire array to the console 5 times
[1,2,3,4,5].forEach(a.targ(console.log, console));

```

Methods
-------

### asunder.split(fn1, fn2, ..., fnn)
Returns a function that splits up the passed in arguments and calls them with a given set of functions. If fewer functions are provided than arguments passed in, the last function will be called with all remaining arguments. Useful for when you want to bubble up errors without the standard `if (err) return callback(err)` pattern.  
  
**Example:**
Suppose this script is called `firstword.js`
```javascript
var s = require('asunder').split;
var fs = require('fs');

function firstWordInFile(file, callback) {
  fs.readFile(file, {encoding: 'utf8'}, s(callback, function(data) {
    callback(null, data.split(' ').shift());
  }));
}

function log(message) {
  if (message) console.log(message);
}

firstWordInFile(process.argv[2], s(log, log));
```
```
$ node firstword.js firstword.js
> var
$ node firstword.js firstword.py
> { [Error: ENOENT, open '..firstword.py'] ... }
```

### asunder.args(fn, start, [end], [context])
Returns a function that when called, will execute `fn` with arguments starting at the zero-based index of `start` and optionally ending at the argument index before `end`. Think of it like calling `Array.prototype.slice` on a set of arguments to pass along to `fn`, because really, that's all this is doing. Optionally define a `context` in which to call `fn`.  
  
### asunder.withArgs(start, [end])
A helper method to generate aliased `asunder.args` functions. For example, `asunder.farg`, `asunder.sarg` and `asunder.targ` are just `asunder.withArgs(0)`, `asunder.withArgs(1)`, and `asunder.withArgs(2)` respectively.  
  
**Example:**
```javascript
/* aliases for first, second, and third arguments */
asunder.farg = asunder.withArgs(0);
asunder.sarg = asunder.withArgs(1);
asunder.targ = asunder.withArgs(2);
```

### asunder.farg(fn, [context])
Returns a function that when called, will exectute `fn` with the first argument passed in, ignoring all other arguments. Optionally, `fn` can be called with a `context`.  
  
### asunder.sarg(fn, [context])
The same as `asunder.farg` but uses the second argument passed in.  
  
### asunder.targ(fn, [context])
The same as `asunder.farg` but uses the third argument passed in.  


License
-------
MIT
