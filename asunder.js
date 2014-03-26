(function() {
  var asunder = {};

  /**
   *  Save a reference to the Array prototype's slice method for convenience
   *
   *  @type {Function}
   */
  var slice = Array.prototype.slice;

  /**
   *  The generealized form of asunder argument slicing 
   *
   *  @param {Function} fn
   *  @param {Number} start - the zero-based index of the first argument to retain
   *  @param {Number=} opt_end - the index after the last argument to retain, defaults to
   *                             start + 1 so as to retain only the start-defined argument
   *  @param {Object=} opt_context - the context to call `fn` with
   *  @return {Function}
   */
  asunder.args = function(fn, start, opt_end, opt_context) {
    var context = typeof opt_end === 'object' ? opt_end : opt_context;
    return function() {
      var end = opt_end || (start + 1);
      return fn.apply(context, slice.call(arguments, start, end));
    };
  };

  /**
   *  A helper method to generate aliased asunder functions
   *
   *  @param {Number} start
   *  @param {Number=} opt_end
   *  @return {Function}
   */
  asunder.withArgs = function(start, opt_end) {
    return function(fn, opt_context) {
      return asunder.args(fn, start, opt_end, opt_context);
    };
  };

  /* aliases for first, second, and third arguments */
  asunder.farg = asunder.withArgs(0);
  asunder.sarg = asunder.withArgs(1);
  asunder.targ = asunder.withArgs(2);

  /**
   *  A function that splits up a function's arguments and calls them with a given set of functions
   *  E.g. `fn(function(err, result) { ... })` can be written as `fn(asunder.split(onError, onResult))`
   */
  asunder.split = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i = 0; i < args.length; i++) {
        if (i === funcs.length - 1) {
          funcs[i].apply(null, args.slice(i));
          break;
        } else {
          funcs[i].call(null, args[i]);
        }
      }
    };
  };

  /* node.js exports */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = asunder;
    }
    exports.asunder = asunder;
  } else {
    this.asunder = asunder;
  }

  /* AMD exports */
  if (typeof define === 'function' && define.amd) {
    define('asunder', [], function() {
      return asunder;
    });
  }
}).call(this);



