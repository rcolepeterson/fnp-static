let MetricsValidator = function() {
  this._propsByValue = {
    d: v => this.clamp(v, 0, 3600), // 3600 sec == 1 hour
    pct: v => this.clamp(v, 0, 100)
  };

  this._isValid = {
    default: v => !(v === '' || v === undefined || v === null),
    rcid: (v, p) =>
      !(
        (v === '' && (p.cg > 1 || p.tp != 'ps')) ||
        v === undefined ||
        v === null
      )
  };

  this._propsExist = {
    l: ['rcid', 'sid', 't'],
    fi: ['rcid', 'sid', 't'],
    us: ['sid', 't', 'd', 'b', 'e', 'aid', 'av', 'mtrv', 'ua', 'plat'],
    c: {
      all: ['tp', 'cid', 'sid', 'cg', 't'],
      ps: ['rcid', 'pt', 'tg'],
      pc: ['d'],
      vs: ['rcid', 'tg'],
      ve: ['rcid', 'tg'],
      vc: ['d', 'pct'],
      vq: ['q']
    },
    i: {
      all: ['tp', 'rcid', 'sid', 'cg', 't'],
      lc: ['url', 'eid'],
      bc: ['eid'],
      ri: ['url', 'tl'],
      si: ['url', 'tl'],
      sh: ['url', 'svc'],
      sw: ['dir'],
      vp: ['pn']
    }
  };
};
Object.assign(MetricsValidator.prototype, {
  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  validate: function(endpoint, params) {
    let invalidProps = [];

    if (this._propsExist[endpoint]) {
      let keys = params.tp
        ? this._propsExist[endpoint].all.concat(
            this._propsExist[endpoint][params.tp]
          )
        : this._propsExist[endpoint];

      keys.forEach(prop => {
        let valueFunc = this._propsByValue[prop];

        if (typeof valueFunc === 'function') {
          params[prop] = valueFunc.call(undefined, params[prop]);
        }

        let isValid =
          typeof this._isValid[prop] === 'function'
            ? this._isValid[prop](params[prop], params)
            : this._isValid.default(params[prop], params);

        if (!isValid) {
          invalidProps.push(prop);
        }
      });
    } else {
      invalidProps.push('endpoint');
    }

    return invalidProps;
  }
});

module.exports = new MetricsValidator();
