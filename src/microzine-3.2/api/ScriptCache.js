let counter = 0;
let scriptMap = new Map();

const ScriptCache = (function(global) {
  return function ScriptCache(scripts) {
    const Cache = {};

    Cache._onLoad = function(key) {
      return cb => {
        let stored = scriptMap.get(key);
        if (stored) {
          stored.promise.then(() => {
            stored.error ? cb(stored.error) : cb(null, stored);
          });
        } else {
          /* eslint-disable no-console */
          console.warn('No script cached');
          /* eslint-enable no-console */
        }
      };
    };

    Cache._scriptscript = (key, src) => {
      if (!scriptMap.has(key)) {
        let script = document.createElement('script');
        let promise = new Promise((resolve, reject) => {
          let body = document.getElementsByTagName('body')[0];

          script.type = 'text/javascript';
          script.async = true;
          script.defer = true;

          const cbName = `loaderCB${counter++}${Date.now()}`;
          //let cb;

          const cleanup = () => {
            if (global[cbName] && typeof global[cbName] === 'function') {
              global[cbName] = null;
            }
          };

          const handleResult = state => {
            return evt => {
              let stored = scriptMap.get(key);

              if (state === 'loaded') {
                stored.resolved = true;
                resolve(src);
              } else if (state === 'error') {
                stored.errored = true;
                reject(evt);
              }

              cleanup();
            };
          };

          script.onload = handleResult('loaded');
          script.onerror = handleResult('error');
          script.onreadystatechange = () => {
            handleResult(script.readyState);
          };

          if (src.match(/callback=CALLBACK_NAME/)) {
            src = src.replace(/(callback=)[^\&]+/, `$1${cbName}`);
            window[cbName] = script.onload;
            //cb = window[cbName] = script.onload;
          } else {
            script.addEventListener('load', script.onload);
          }

          script.addEventListener('error', script.onerror);

          script.src = src;
          body.appendChild(script);

          return script;
        });

        let initialState = {
          loaded: false,
          error: false,
          promise,
          script
        };

        scriptMap.set(key, initialState);
      }

      return scriptMap.get(key);
    };

    Object.keys(scripts).forEach(key => {
      const script = scripts[key];
      Cache[key] = {
        script: Cache._scriptscript(key, script),
        onLoad: Cache._onLoad(key)
      };
    });

    return Cache;
  };
})(window);

export default ScriptCache;
