'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopDefault(e){return(e&&(typeof e==='object')&&'default'in e)?e['default']:e}var jss=require('jss'),jss__default=_interopDefault(jss),preset=_interopDefault(require('jss-preset-default'));function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var key = {
  key: 'value'
};

var generateNewKey = function generateNewKey() {
  key = {
    key: 'value'
  };
};

var getKey = function getKey() {
  if (!key) {
    generateNewKey();
  }

  return key;
};var withStyles = {
  data: function data() {
    return {
      sheet: {},
      sheetStr: ''
    };
  },
  inject: {
    theme: {
      default: {}
    },
    sheets: {
      default: null
    }
  },
  computed: {
    classes: function classes() {
      return this.sheet.classes;
    }
  },
  watch: {
    theme: {
      deep: true,
      handler: function handler() {
        this.generateSheet();
      }
    }
  },
  created: function created() {
    this.generateSheet();
  },
  mounted: function mounted() {
    // remove this after we can fallback to server side config.
    this.$forceUpdate();
  },
  destroyed: function destroyed() {
    this.getSheetManager().unmanage(this.theme);
  },
  methods: {
    generateSheet: function generateSheet() {
      var sheetsManager = this.getSheetManager();
      var themeKey = getKey();
      var oldSheet = sheetsManager.get(themeKey);
      var sheet;

      if (oldSheet) {
        sheet = oldSheet;
        this.sheet = sheet;
      } else {
        sheet = jss__default.createStyleSheet(this.$options.styles);
        sheet = sheet.update(this.theme);
        sheetsManager.add(themeKey, sheet);

        if (process.server) {
          this.sheets.add(sheet);
        }
      }

      this.sheet = sheetsManager.manage(themeKey);
    },
    getSheetManager: function getSheetManager() {
      if (!this.constructor.sheetsManager) {
        this.constructor.sheetsManager = new jss.SheetsManager();
      }

      return this.constructor.sheetsManager;
    }
  }
};//
jss__default.setup(preset());
var script = {
  name: 'ThemeProvider',
  props: {
    theme: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      sheets: new jss.SheetsRegistry()
    };
  },
  provide: function provide() {
    return {
      theme: this.theme,
      sheets: this.sheets
    };
  },
  computed: {
    sheetStr: function sheetStr() {
      return this.sheets.toString();
    }
  },
  watch: {
    theme: {
      deep: true,
      handler: function handler() {
        generateNewKey();
      }
    }
  },
  created: function created() {
    // remove ssr styles from meta and fallback to attach method.
    if (process.client) {
      this.$meta().refresh();
    }
  },
  head: function head() {
    return {
      style: [{
        cssText: this.sheetStr,
        type: 'text/css'
      }]
    };
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    attrs: {
      "id": "themeProvider"
    }
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-664a78de";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);var components=/*#__PURE__*/Object.freeze({__proto__:null,withStyles: withStyles,ThemeProvider: __vue_component__});var install = function installNuxtJss(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        componentName = _ref2[0],
        component = _ref2[1];

    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Default export is library as a whole, registered via Vue.use()
exports.ThemeProvider=__vue_component__;exports.default=plugin;exports.withStyles=withStyles;