define(function() {
  function Proxy(target, interceptor) {
    function wrap(methodName, method) {
      return function() {
        var invocation = {
          method: methodName,
          arguments: $.makeArray(arguments),
          proceed: function() {
            this.returnValue = method.apply(target, this.arguments)
          }
        };
        interceptor.call(target, invocation);
        return invocation.returnValue;
      };
    };
    var key, value;
    for (key in target) {
      value = target[key]; 
      if ($.isFunction(value)) {
        this[key] = wrap(key, value);
      }
    }
  }
  
  return Proxy;
});
