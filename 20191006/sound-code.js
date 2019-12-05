/*!
 * Vue.js v2.6.10  版本v2.6.10
 * (c) 2014-2019 Evan You  尤玉溪
 * Released under the MIT License. MIT协议
 */

 // global  全局
 // factory  工厂
 // module.exports 提供了暴露接口的方法
 (function (global, factory) {
 	typeof exports === 'object' && (typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function') && (define.amd ? define(factory) : (global = global || self, global.Vue = factory()));
 }(this, function () { 'use strict';

 	/*  */

 	// Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改
 	var emptyObject = Object.freeze({});

 	// These helpers produce better VM code in JS engines due to their
 	// 这些帮助程序在JS引擎中生成了更好的VM代码
 	// explicitness and function inlining.
 	// 明确性和函数插入
 	function isUndef (v) {
 		return v === undefined || v === null
 	}

 	function isDef (v) {
 		return v !== undefined && v !== null
 	}

 	function isTrue (v) {
 		return v === true
 	}

 	function isFalse (v) {
 		return v === false
 	}

 	/**
 	 * Check if value is primitive.
 	 *	检查值是否是原始的
 	 */
	function isPrimitive (value) {
		return (
			typeof value === 'string' ||
			typeof value === 'number' ||
			// $flow-disable-line
			typeof value === 'symbol' ||
			typeof value === 'boolean'
		)
	}

	/**
	* Quick object check - this is primarily used to tell 快速对象检查——这主要用于判断
	* Objects from primitive values when we know the value 当我们知道值是兼容json的类型时，从原始值中获取对象
	* is a JSON-compliant type.
	*/
	function isObject (obj) {
		return obj !== null && typeof obj === 'object'
	}

	/**
	* Get the raw type string of a value, e.g., [object Object]. 获取值的原始类型字符串
	*/
 	var _toSrtring = Object.prototype.toString;

	/**
	* Strict object type check. Only returns true for plain JavaScript objects. 严格的对象类型检查。仅对普通JavaScript对象返回true。
	*/
	function isPlainObject (obj) {
		return _toString.call(obj) === '[object Object]'
	}

	function isRegExp (v) {
		return _toString.call(v) === '[object RegExp]'
	}

	/**
	 * Check if val is a valid array index. 检查val是否是一个有效的数组索引。
	 */
	 // isFinite() 函数用来判断被传入的参数值是否为一个有限数值
	function isValidArrayIndex (val) {
		var n = parseFloat(String(val));
		return n >= 0 && Math.floor(n) === n && isFinite(val)
	}

	function isPromise (val) {
		return (
			isDef(val) &&
			typeof val.then === 'function' && 
			typeof val.catch === 'function'
		)
	}

	/**
	* Convert a value to a string that is actually rendered. 将值转换为实际呈现的字符串。
	*/
	function toString (val) {
		return val == null
			? ''
			: Array.isArray(val) || ( isPlainObject(val) && val.toString === _toString)
				? JSON.stringify(val, null, 2)
				: String(val)
	}

	/**
	* Convert an input value to a number for persistence. 将输入值转换为数字以实现持久性。
	* If the conversion fails, return original string. 如果转换失败，返回原始字符串。
	*/
	function toNumber (val) {
		var n = parseFloat(val);
		return isNaN(n) ? val : n
	}

	/**
	* Make a map and return a function for checking if a key is in that map. 创建一个映射并返回一个函数，用于检查该映射中是否有键。
	*/
	// Object.create方法创建一个新对象，使用现有的对象来提供新创建的对象的proto
	// toLowerCase() 方法用于把字符串转换为小写
	function makeMap (str, expectsLowerCase) {
		var map = Object.create(null);
		var list = str.split(',');
		for (var i = 0; i <list.length; i++) {
			map[list[i]] = true;
		}
		return expectsLowerCase
		? function (val) { return map[val.toLowerCase()];}
		: function (val) { return map[val]; }
	}

	/**
	* Check if a tag is a built-in tag. 检查标签是否是内置标签。
	*/
	var isBuiltInTag = makeMap('slot,component', true);

	/**
	* Check if an attribute is a reserved attribute. 检查属性是否为保留属性。
	*/
	var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

	/**
	* Remove an item from an array.
	从数组中删除项。
	*/
	function remove (arr, item) {
		if (arr.length) {
			var index = arr.indexOf(item);
			if (index > -1) {
				return arr.splice(index, 1)
			}
		}
	}

	/**
	* Check whether an object has the property. 检查对象是否具有该属性。
	*/
	// call 改变this指向
	// hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn (obj, key) {
		return hasOwnProperty.call(obj, key)
	}

	/**
	* Create a cached version of a prue function. 创建纯函数的缓存版本。
	*/
	function cached (fn) {
		var cache = Object.create(null);
		return (function cachedFn (str) {
			var hit = cache[str];
			return hit || (cache[str] = fn(str))
		})
	}

	/**
	* Camelize a hyphen-delimited string. 使连字符分隔的字符串驼峰化。
	*/
	// toUpperCase() 方法用于把字符串转换为大写
	var camelizeRE = /-(\w)/g;
	var camelize = cached(function (str) {
		return str.replace(camelizeRE, function (_, c) { return c ? c.tpUpperCase() : '';})
	});

	/**
	* Capitalize a string.
	字符串首字母大写
	*/
	// charAt() 方法可返回指定位置的字符
	var capitalize = cached(function (str) {
		return str.charAt(0).soUpperCase() + str.slice(1)
	});

	/**
	* Hyphenate a camelCase string.
	用连字符连接驼峰线。
	*/
	var hyphenateRE = /\B([A-Z])/g;
	var hyphenate = cached(function (str) {
		return str.replace(hyphenateRE, '-$1').toLowerCase()
	});

	/**
	* Simple bind polyfill for environments that do not support it, 简单绑定polyfill用于不支持它的环境，
	* e.g., PhantomJS 1.x.Technically, we don't need this anymore
	* since vative bind is now performant enough in most browsers.
	我们不再需要PhantomJS 1.x.了，因为vative bind现在在大多数浏览器中都有足够的性能
	* But removing it would mean breaking code that was able to run in PhantomJS 1.x, so this must be kept for backward compatibility.
	但是删除它将意味着破坏能够在PhantomJS 1中运行的代码。因此，为了向后兼容，必须保留这个。
	*/
	function polyfillBind (fn, ctx) {
		function boundFn (a) {
			var l = arguments.length;
			return l
				? l > 1
					? fn.apply(ctx, arguments)
					: fn.call(ctx, a)
				: fn.call(ctx)
		}

		boundFn._length = fn.length;
		return boundFn
	}

	function nativeBind (fn, ctx) {
		return fn.bind(ctx)
	}

	var bind = Function.prototype.bind
		? nativeBind
		: polyfillBind;

	/**
	* Convert an Array-like object to a real Array. 将类似数组的对象转换为实际数组。
	*/
	function toArray (list, start) {
		start = start || 0;
		var i = list.length - start;
		var ret = new Array(i);
		while (i--) {
			ret [i] = list[i + start];
		}
		return ret
	}

	/**
	* Mix properties into target object. 将属性混合到目标对象中。
	*/
	function extend (to, _from) {
		for (var key in _from) {
			to[key] = _from[key];
		}
		return to
	}

	/**
	* Merge an Array of Objects into a single Object. 将一个对象数组合并到一个对象中。
	*/
	function toObject (arr) {
		var res = {};
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]) {
				extend(res, arr[i]);
			}
		}
		return res
	}

	// eslint-disable no-unused-vars

	/**
	* Perform no operation.
	* Stubbing args to male Flow happy without leaving useless transpiled code  在不留下无用的已转置代码的情况下，对arg进行存根处理以使流更流畅
	* with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
	*/
	function noop (a, b, c) {}

	/**
	* Always return false.
	*/
	var no = function (a, b, c) {
		return false;
	};

	/* eslint-enable no-unused-vars */

	/**
	* Return the same value.
	*/
	var identity = function (_) {
		return _;
	};

	/**
	* Generate a string containing static keys from compiler modules. 从编译器模块生成包含静态键的字符串
	*/
	// concat() 方法用于连接两个或多个数组
	function genStaticKeys (modules) {
		return modules.reduce(function (keys, m) {
			return keys.concat(m.staticKeys || [])
		}, []).join(',')
	}

	/**
	* Check if two values are loosely equal - that is, 检查两个值是否松散相等——也就是说，
	* if they are plain objects, do they have the same shape? 如果它们是简单的对象，它们有相同的形状吗?
	*/
	function looseEqual (a, b) {
		if (a === b) { return true }
		var isObjectA = isObject(a);
		var isObjectB = isObject(b);
		if ( isObjectA && isObjectB) {
			try {
				var isArrayA = Array.isArray(a);
				var isArrayB = Array.isArray(b);
				if (isArrayA && isArrayB) {
					// every() 方法用于检测数组所有元素是否都符合指定条件
					return a.length === b.length && a.every(function (e, i) {
						return looseEqual(e, b[i])
					})
					// instanceof 严格来说是Java中的一个双目运算符，用来测试一个对象是否为一个类的实例
				} else if (a instanceof Date && b instanceof Date) {
					return a.getTime() === b.getTime()
				} else if (!isArrayA && !isArrayB) {
					// Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 。如果对象的键-值都不可枚举，那么将返回由键组成的数组
					var keysA = Object.keys(a);
					var keysB = Object.keys(b);
					return keysA.length === keysB.length && keysA.every(function (key) {
						return looseEqual(a[key], b[key])
					})
				} else {
					return false
				}
			} catch (e) {
				return false
			}
		}else if ( !isObjectA && !isObjectB) {
			return String(a) === String(b)
		} else {
			return false
		}
	}

	/** 
	* Return the first index at which a loosely equal value can be
	* found in the array (if value is a plain object, the array must contain an object of the same shape), or -1 if it is not present.
	返回可以在数组中找到相等值的第一个索引(如果值是普通对象，则数组必须包含相同形状的对象)，如果不存在，则返回-1索引
	*/
	function looseIndexOf (arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (looseEqual(arr[i], val)) {
				return i
			}
		}
		return -1
	}

	/**
	* Ensure a function is called only once. 确保一个函数只被调用一次。
	*/
	function once (fn) {
		var called = false;
		return function () {
			if (!called) {
				called = true;
				fn.apply(this, arguments);
			}
		}
	}

	var SSR_ATTR = 'data-server-rendered';

	var ASSET_TYPES = [
		'component',
		'directive',
		'filter'
	];

	var LIFECYCLI_HOOKS = [
		'beforeCreate',
		'created',
		'beforeMount',
		'mounted',
		'beforeUpdate',
		'updated',
		'beforeDestroy',
		'destroyed',
		'activated',
		'deactivated',
		'errorCaptured',
		'serverPrefetch'
	];

	/*  */


	var config = ({
		/**
		* Option merge strategies (used in core/util/options) 选项合并策略(在core/util/options中使用)
		*/
		// $flow-disable-line
		oprionMergeStratagies: Object.create(null),

		/**
		* Whether to suppress warnings. 是否取消警告。
		*/
		silent: false,

		/**
		* Show production mode tip message on boot? 启动显示生产模式提示信息?
		*/
		productionTip: "development" !== 'production',

		/**
		* Whether to enabke devtools 是否启用开发者工具
		*/
		devtools: "development" !== 'production',

		/**
		* Whether to record perf 是否记录性能
		*/
		performance:false,

		/**
		* Error handler for watcher errors 用于监视程序错误的错误处理程序
		*/
		errorHandler:null,

		/**
		* Warn handler for watcher warns 监视程序警告的警告处理程序
		*/
		warnHandler: null,

		/**
		* Ignore certain custom elements 忽略某些自定义元素
		*/
		ignoredElements: [],

		/**
		* Custom user key aliases for v-on 为v-on定制用户密钥别名
		*/
		// $flow-disable-line
		keyCodes: object.create(mull),

		/**
		* Check if a tag is reserved so that it cannot be registered as a component. This is platform-dependent and may be overwritten. 检查标记是否保留，以便不能将其注册为组件。这是平台相关的，可能会被覆盖。
		*/
		isReservedTag: no,

		/**
		* Check if an attribute is reserved so that it cannot be used as a component prop. This is platform-dependent and may be overwritten. 检查是否是属性保留，使其不能用作组件支柱。这是平台相关的，可能会被覆盖。
		*/
		isReservedAttr: no,

		/**
		* Check if a tag is an unknown element. Platform-dependent. 检查标记是否为未知元素。平台相关的。
		*/
		isUnknownElenemt: no,

		/**
		* Get the namespace of an element 获取元素的命名空间
		*/
		getTagNamespace: noop,

		/**
		* Parse the real tag name for the specific platform. 解析特定平台的实际标记名称
		*/
		parsePlatformTagName: identity,

		/**
		* Check if an attribute must be bound using property, e.g. value Platform-dependent.
		检查属性是否必须使用属性绑定，例如，值与平台相关。
		*/
		mustUseProp: no,

		/**
		* Perform updates asynchronously. Intended to be used by Vue Test Utils. This will significantly reduce performance if set to false. 异步执行更新。用于测试Vue 组件。如果设置为false，这将显著降低性能。
		*/
		async: true,

		/**
		* Exposed for legacy reasons 由于遗留原因而暴露
		*/
		_lifecycleHooks: LIFECYCLE_HOOKS
	})

	/*  */

	/**
	* unicode letters used for parsing html tags, component names and property paths. using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname skipping \u10000- \uEFFFF due to it freezing up PhantonJS 

	*用于解析html标记、组件名称和属性路径的unicode字母。使用https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname(潜在的自定义元素名)跳过\u10000- \uEFFFF，因为它冻结了PhantonJS
	*/
	var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

	/**
	* Check if a string starts with $ or _  检查字符串是否以$或_开头
	*/
	function isReserved (str) {
		var c = (str + '').charCodeAt(0);
		return c === 0x24 || c === 0x5F
	}

	/**
	* Define a property. 定义一个属性。
	*/
	function def (obj, key, val, enumerable) {
		// Object.defineProperty()的作用就是直接在一个对象上定义一个新属性，或者修改一个已经存在的属性
		Object.defineProperty(obj, key, {
			value: val,
			enumerable: !!enumerable,
			writable: true, // 对象是否可以改变
			configurable: true // 描述属性是否配置，以及可否删除
		});
	}

	/**
	* Parse simple path. 解析简单路径。
	*/
	// source 属性用于返回模式匹配所用的文本
	var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\d]"));
	function parsePath (path) {
		// test() 方法用于检测一个字符串是否匹配某个模式
		if (bailRE.test(path)) {
			return
		} 
		var segments = path.split('.');
		return function (obj) {
			for (var i = 0; i < segments.length; i++) {
				if (!obj) { return }
				obj = obj[segments[i]];
			}
			return obj
		}
	}

	/*  */

	// can we use __proto__?
	var hasProto = '__proto__' in {};

	// Browser environment sniffing浏览器环境中嗅探
	var inBrowser = typeof window !== 'undefined';
	// 通过WXEnvironment.platform来确定代码运行在哪个平台
	var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
	// toLowerCase() 来把字符串转换成小写
	var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
	// userAgent 属性返回由浏览器发送到服务器的用户代理报头（user-agent header）
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE = UA && /msie|trident/.test(UA);
	var isIE9 = UA && UA.indexOf('msie9.0') > 0;
	var isEdge = UA && UA.indexOf('edge/') > 0;
	var isAndroin = (UA && UA.indexOf(android) > 0) || (weexPlatform === 'android');
	var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
	var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
	var isPhantomJS = UA && /phantomjs/.test(UA);
	// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配
	var isFF = UA && UA.match(/firefox\/(\d+)/);

	// Firefox has a "watch" function on Object.prototype...
	var nativeWatch = ({}).watch;
	var supportsPassive = false;
	if (inBrowser) {
		try {
			var opts = {};
			// Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
			Object.defineProperty(opts, 'passive', ({
				get:function get () {
					/* istanbul ignore next */
					supportsPassive = true;
				}
			})); // https://github.com/facebook/flow/issues/285
			window.addEventListener('test-passive', null.opts);
		} catch (e) {}
	}

	// this needs to be lazy-evaled because vue may be required before
	// vue-server-renderer can set VUE_ENV
	var _isServer;
	var isServerRendering = function () {
		if (_isServer === undefined) {
			/* istanbul ignore if */
			if (!inBrowser && !inWeex && typeof global !== 'undefined') {
				// detect presence of vue-server-renderer and avoid
				// Webpack shimming the process 检测vue-server-renderer的presence，避免Webpack对进程的影响
				_isServer = global['process'] && globl['process'].env.VUE_ENV === 'server';
			} else {
				_isServer = false;
			}
		}
		return _isServer
	};

	// detect devtools 检测开发者工具
	var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	/* istanbul ignore next */
	function isNative (Ctor) {
		return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
	}

	// Reflect.ownKeys方法会返回一个数组，此数组中包含有参数对象自有属性名称
	var hasSymbol = 
		typeof Symbol !== 'undefined' && isNative(Symbol) &&
		typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

	var _Set;
	/* istanbul ignore if */ // $flow-disable-line
	if (typeof Set !== 'undefined' && isNative(Set)) {
		// use native Set when available. 可用时使用本地的set。
		_Set = Set;
	} else {
		// a non-standard Set polyfill that only works with primitive keys.
		_Set = /*@__PURE__*/(function () {
			function Set () {
				this.set = Object.create(null);
			}
			Set.prototype.has = function has (key) {
				return this.set[key] === true
			};
			Set.prototype.add = function add (key) {
				this.set[key] = true;
			};
			Set.prototype.clear = function clear () {
				this.set = Object.create(null);
			};

			return Set;
		}());
	}

	 /* */
	 var warn = noop;
	 var tip = noop;
	 var generateComponentTrace = (noop); // work around flow check
	 var formatComponentName = (noop);

	 {
        var hasConsole = typeof console !== 'undefined';
        var classifyRE = /(?:^|[-_])(\w)/g;
        var classify = function (str) { return str
            .replace(classifyRE, function (c) { return c.toUpperCase(); })
			.replace(/[-_]/g, '');
        };
        warn = function (msg, vm) {
            var trace = vm ? generateComponentTrace(vm) : '';

            if (config.warnHandler) {
                config.warnHandler.call(null, msg, vm, trace);
            } else if (hasConsole && (!config.silent)) {
                console.error(("[Vue warn]:" + msg + trace));
            }
        };

        tip = function (msg, vm) {
            if (hasConsole && (!config.silent)) {
				console.warn("[Vue tip]: " + msg + (
					vm ? generateComponentTrace(vm) : ''
				));
            }
        };

        formatComponentName = function (vm, includeFile) {
            if (vm.$root === vm) {
                return '<Root>'
            }
            var options = typeof vm === 'function' && vm.cid != null
                ? vm.options
                : vm._isVue
                    ? vm.$options || vm.constructor.options
                    : vm;
            var name = optins.name || oprions._compinentTag;
            var file = options.__file;
            if (!name && file) {
                var match = file.match(/([^/\\]+).vue$/);
                name = match && match[1];
            }

            return (
                (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
                (file && includeFile !== false ? (" at " + file) : '')
            )
        };

        var repeat = function (str, n) {
            var res = '';
            while (n) {
                if (n % 2 === 1) { res += str; }
                if (n > 1) { str += str; }
                n >>= 1;
            }
            return res
        };

        generateComponentTrace = function (vm) {
            if (vm._isVue && vm.$parent) {
                var tree = [];
                var currentRecursiveSequence = 0;
                while (vm) {
                    if (tree.length > 0) {
                        var last = tree[tree.length - 1];
                        if (last.constrcutor === vm.constructor) {
                            currentRecursiveSequence++;
                            vm = vm.$parent;
                            continue
                        } else if (currentRecursiveSequence > 0) {
                            tree[tree.length - 1] = [last, currentRecursiveSequence];
                            currentRecursiveSequence = 0;
                        }
                    }
                    tree.push(vm);
                    vm = vm.$parent;
                }
                return '\n\nfound in\n\n' + tree
                    .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
                        ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
                        : formatComponentName(vm))); })
                    .join('\n')
            } else {
                return ("\n\n(found in " + (formatComponentName(vm)) + ")")
            }
        };
	 }

	 /* */

     var uid = 0;

     /**
      * A dep is an observable that can have multiple
      * directives subscribing to it.  dep是一个可观察的，可以有多个指令订阅它。
      */
     var Dep = function Dep () {
         this.id = uid++;
         this.subs = [];
     };

     Dep.prototype.addSub = function addSub (sub) {
         this.subs.push(sub);
     };

     Dep.prototype.removeSub = function removeSub (sub) {
         remove(this.subs, sub);
     };

     Dep.prototype.depend = function depend () {
         if (dep.target) {
             Dep.target.addDep(this);
         }
     };

     Dep.prototype.notify = function notify () {
         // stabilize the subscriber list first 首先稳定订阅列表
         var subs = this.subs.slice();
         if (!config.async) {
             // subs aren't sorted in scheduler if not running async
             // we need to sort them now make sure they fire in correct
             // order 子不排序在调度如果不运行异步，我们现在需要排序，以确保他们在正确的顺序发射
             subs.sort(function (a, b) { return a.id - b.id; });
         }
         for (var i = 0, l = subs.length; i < l; i++) {
             subs[i].update();
         }
     };

     // The current target watcher being evaluated. 正在评估的当前目标监视程序。
     // This is globally unique because only one watcher
     // can be evaluated at a time. 这是全局惟一的，因为一次只能计算一个观察者。
     Dep.target = null;
     var targetStack = [];

     function pushTarget (target) {
         tyargetStack.push(target);
         Dep.target = target;
     }

     function popTarget () {
         targetStack.pop();
         Dep.target = targetStack[targetStack.length - 1];
     }

     /* */

     var VNode = function VNode (
         tag,
         data,
         children,
         text,
         elm,
         context,
         componentOptions,
         asyncFactory
     ) {
         this.tag = tag;
         this.data = data;
         this.children = children;
         this.text = text;
         this.elm = elm;
         this.ns = undefined;
         this.context = context;
         this.fnContext = undefined;
         this.fnOptions = undefined;
         this.fnScopeId = undefined;
         this.key = data && data.key;
         this.componentOptions = componentOptions;
         this.componentInstance = undefined;
         this.parent = undefined;
         this.raw = false;
         this.isRootInsert = true;
         this.isStatic = false;
         this.isComment = false;
         this.isCloned = false;
         this.isOnce = false;
         this.asyncFactory = asyncFactory;
         this.asyncMeta = undefined;
         this.isAsyncPlaceholder = false;
     };

     var prototypeAccessors = { child: { configurable: true } };

     // DEPRECATED: alias for componentInstance for backwards compat. 弃用:组件实例的别名，用于向后编译。
     /* istanbul igmore next*/
     prototypeAccessors.child.get = function () {
         return this.componentInstance
     };
     Object.defineProperties( VNode.prorotype, prototypeAccessors );

     var createEmptyVNode = function (text) {
         if ( text === void 0 )  text = '';

         var node = new VNode();
         node.text = text;
         node.isComment = true;
         return node
     };

     function createTextVNode (val) {
         return new VNode(undefined, undefined, undefined, String(val))
     }

     // optimized shallow clone 优化浅克隆
     // used for static nodes and slot nodes because they may be reused across
     // multiple renders, cloning them avoids errors when DOM manipulations rely
     // on their elm reference. 用于静态节点和插槽节点，因为它们可以跨多个呈现重用，所以在DOM操作依赖于它们的elm引用时，克隆它们可以避免错误。
     function cloneVNode (vnode) {
         var cloned = new VNode(
             vnode.tag,
             vnode.data,
             // #7975
             // clone children array to avoid mutating original incase of cloning
             // a child. 克隆子元素数组，以避免在克隆子元素时发生突变。
             vnode.children && vnode.children.slice(),
             vnode.text,
             vnode.elm,
             vnode.context,
             vnode.componentOptions,
             vnode.asyncFactory
         );
         cloned.ns = vnode.ns;
         cloned.isStatic = vnode.isStatic;
         cloned.key = vnode.key;
         cloned.isComment = vnode.isComment;
         cloned.fnContext = vnode.fnContext;
         cloned.fnPotions = vnode.fnOptions;
         cloned.fnScopeId = vnode.fnScopeId;
         cloned.asyncMeta = vnode.asyncMeta;
         cloned.isCloned = true;
         return cloned
     }

     /**
      * not type checking this file because flow doesn't play well with
      * dynamically accessing methods on Array prototype 没有对这个文件进行类型检查，因为流不能很好地处理数组原型上的动态访问方法
      */

     var arrayProto = Array.prototype;
     var arrayMethods = Object.create(arrayProto);

     var methodsToPatch = [
         'push',
         'pop',
         'shift',
         'unshift',
         'splice',
         'sort',
         'reverse'
     ];

     /**
      * Intercept mutating methods and emit events
      */
     methodsToPatch.forEach(function (method) {
         // cache original method
         var original = arrayProto[method];
         def(arrayMethods, method, function mutator () {
             var args = [], len = arguments.length;
             while ( len-- ) args[ len ] = arguments[ len ];

             var result = original.apply(this, args);
             var ob = this.__ob__;
             var inserted;
             switch (method) {
                 case 'push':
                 case 'unshift':
                     inserted = args;
                     break
                 case 'splice':
                     inserted = args.slice(2);
                     break
             }
             if (inserted) { ob.observeArray(inserted); }
             // notify change
             ob.dep.notify();
             return result
         });
     });

     /*  */

	 var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

	 /**
	  * In some cases we may want to disable observation inside a component's
	  * update computation. 在某些情况下，我们可能希望禁用组件更新计算中的观察。
	  */
	 var shouldObserve = true;

	 function toggleObserving (value) {
	 	shouldObserve = value;
	 }

	 /**
	  * Observer class that is attached to each observed
	  * Object. Once attached, the onserver converts the target
	  * object's property keys into getter/setters that
	  * collect dependencies and dispatch updates. 附加到每个被观察对象的观察者类。一旦附加，onserver将目标对象的属性键转换为getter/setter，用于收集依赖项和分派更新。
	  */
	 var Observer = function Observer (value) {
	 	this.value = value;
	 	this.dep = new Dep();
	 	this.vmCount = 0;
	 	def(value, '__ob__', this);
	 	if (Array.isArray(value)) {
	 		if (hasProto) {
	 			protoAugment(value, arrayMethods);
			} else {
	 			copyAugment(value, arrayMethods, arrayKeys);
			}
	 		this.observeArray(value);
		} else {
	 		this.walk(value);
		}
	 };

	 /**
	  * Walk through all properties and convert them into
	  * getter/setters. This method should only be called when
	  * value type is Object. 遍历所有属性并将它们转换为getter/setter。仅当值类型为Object时才应调用此方法。
	  */
	 Observer.prototype.walk = function walk (obj) {
	 	var keys = Object.keys(obj);
	 	for (var i = 0; i < keys.length; i++) {
	 		defineReactive$$1(obj, keys[i]);
		}
	 };

	 /**
	  * Observe a list of Array items.
	  */
	 Observer.prototype.observeArray = function observeArray (items) {
	 	for (var i = 0, l = items.length; i < l; i++) {
	 		observe(items[i]);
		}
	 };

	 // helpers

	 /**
	  * Augment a target Object or Array by intercepting
	  * the prototype chain using __proto__ 通过使用_proto__拦截原型链来增加目标对象或数组
	  */
	 function protoAugment (target, src) {
	 	 /* eslint-disable no-proto */
		 target.__proto__ = src;
		 /* eslint-enable no-proto */
	 }

	 /**
	  * Augment a target Object or Array by defining
	  * hidden properties. 通过定义隐藏属性来扩充目标对象或数组。
	  */
	 /* istanbul ignore next */
	 function copyAugment (target, src, keys) {
	 	for (var i = 0, l = keys.length; i < l; i++) {
	 		var key = keys[i];
	 		def(target, key, src[key]);
		}
	 }

	 /**
	  * Attempt to create an observer instance for a value,
	  * returns the new observer if successfully observed,
	  * or the existing observer if the value already has one.
	  */
	 function observe (value, asRootData) {
	 	if (!isObject(value) || value instanceof VNode) {
	 		return
		}
	 	var ob;
	 	if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
	 		ob = value.__ob__;
		} else if (
			shouldObserve &&
			!isServerRendering() &&
			(Array.isArray(value) || isPlainObject(value)) &&
			Object.isExtensible(value) &&
			!value._isVue
		) {
	 		ob = new Observer(value);
		}
	 	if (asRootData && ob) {
	 		ob.vmCount++;
		}
	 	return ob
	 }

	 /**
	  * Define a reactive property on an Object. 在对象上定义反应性属性。
	  */
	 function defineReactive$$1 (
	 	obj,
		key,
		val,
		customSetter,
		shallow
	 ) {
	 	var dep = new Dep();
	 	var property = Object.getOwnPropertyDescriptor(obj, key);
	 	if (property && property.configurable === false) {
	 		return
		}

	 	// cater for pre-defined getter/setters
		var getter = property && property.get;
	 	var setter = property && property.set;
	 	if ((!getter || setter) && arguments.length === 2) {
	 		val = obj[key];
		}

	 	var childOb = !shallow && observe(val);
	 	Object.defineProperty(obj, key, {
	 		enumerable: true,
			configurable: true,
			get: function reactiveGetter () {
	 			var value = getter ? getter.call(obj) : val;
	 			if (Dep.target) {
	 				dep.depend();
	 				if (childOb) {
	 					childOb.dep.depend();
	 					if (Array.isArray(value)) {
	 						dependArray(value);
						}
					}
				}
	 			return value
			},
			set: function reactiveSetter (newVal) {
	 			var value = getter ? getter.call(obj) : val;
	 			/* eslint-disable no-self- compare */
				if (newVal === value || (mewVal !== newVal && value !== value)) {
					return
				}
				/* eslint-enable no-self-compare */
				if (customSetter) {
					customSetter();
				}
				// #7981: for accessor properties without setter
				if (getter && !setter) { return }
				if(setter) {
					setter.call(obj, newVal);
				} else {
					val =- newVal;
				}
				childOb = !shallow && observe(newVal);
				dep.notify();
			}
		});
	}

	/**
	 * Set a property on an object. Adds the new property and triggers change notigication if the property doesn't already exist. 设置对象的属性。添加新属性并在属性不存在时触发更改通知。
	 */
	 function set (target, key, val) {
	 	if (isUndef(target) || isPrimitive(target)
	 	) {
	 		warn(("Cannot set reactive property on undefined, null, or primitive value:" + ((target))));
	 	}
	 	if (Array.isArray(target) && isValidArrayIndex(key)) {
	 		target.length = Math.max(target.length, key);
	 		target.splice(key, 1, val);
	 		return val
	 	}
	 	if (key in target && !(key in Objcet.prototype)) {
	 		target[key] = val;
	 		return val
	 	}
	 	var ob = (target).__ob__;
	 	if (target._isVue || (ob && ob.vmCount)) {
	 		varn('Avoid adding reactive properties to a Vue instance or its root $data ' +
	 			'at runtime - declare it upfront in the data option.'
	 		);
	 		return val
	 	}
	 	if (!ob) {
	 		target[key] = val;
	 		return val
	 	}
	 	defineReactive$$1(ob.value, key, val);
	 	ob.dep.notify();
	 	return val
	 }

	 /**
	  * Delete a property and trigger change if necessary.删除属性并在必要时触发更改。
	  */
	function del (target, key) {
		if (isUndef(target) || isPrinitive(target)
		) {
			warn(("Cannot delete reactive property on undefined, null, or primitive value:" + ((target))));
		}
		if (Array.isArray(target) && isValidArrayIndex(key)) {
			target.splice(key, 1);
			return
		}
		var ob = (target).__ob__;
		if (target._isVue || (ob && ob.vmCount)) {
			warn('Avoid deleting properties on a Vue instance or its root $data' + '- just set it to null.');
			return
		}
		if (!hasOwn(target, key)) {
			return
		}
		delete target[key];
		if (!ob) {
			return
		}
		ob.dep.notify();
	}

	/**
	 * Collect dependencies on array elements when the array is touched, since we cannot intercept array element access like property getters. 当数组被触摸时，收集数组元素的依赖项，因为我们不能像属性getter那样拦截数组元素的访问。
	 */
	function dependArray (value) {
		for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
			e = value[i];
			e && e.__ob__ && e.__ob__.dep.depend();
			if (Array.isArray(e)) {
				dependArray(e);
			}
		}
	}

	/*  */

	/**
	 * Option overwriting strategies are functions that handle how to merge a parent option value and a child option
	 * value into the final value. 选项覆盖策略是处理如何将父选项值和子选项值合并到最终值的函数。
	 */
	var strats = config.optionMergeStrategies;

	/**
	 * Options with restrictions
	 */
	{
		strats.el = strats.propsData = function (parent, child, vm, key) {
			if (!vm) {
				warn(
					"option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.'
					);
			}
			return degaultStrat(parent, child)
		};
	}

	/**
	 * Helper that recursively merges two data objects together.递归地合并两个数据对象的助手。
	 */
	function mergeData (to, from) {
		if (!from) { return to }
		var key, toVal, fromVal;

		var keys = hasSumbol
			? Reflect.ownKeys(from)
			: Object.keys(from);

		for (var i = 0; i < keys.length; i++) {
			key = keys[i];
			// in case the object is already onserved...
			if (key === '__ob__') { continue }
			toVal = to[key];
			fromVal = from[key];
			if (!hasOwn(to, key)) {
				set(to, key, fromVal);
			} else if (
				toVal !== fromVal &&
				isPlainObject(toVal) &&
				isPlainObject(fromVal)
			) {
				mergeData(toVal, fromVal);
			}
		} 
		return to
	}

	/**
	 * Data
	 */
	function mergeDataOrFn (
		parentVal,
		childVal,
		vm
	) {
		if (!vm) {
			// in a Vue.extend merge, both should be functions.  Vue。扩展归并，两者都应该是函数
			if (!childVal) {
				return parentVal
			}
			if (!parentVal) {
				return childVal
			}
			// when parentVal & childVal are both present,
			// we need to return a function that returns the
			// metged result of both functions... mo meed to
			// check if parentVal is a function here bacause
			// it has to be a function to pass previous merges. 当parentVal和childVal都存在时，我们需要返回一个函数，该函数返回两个函数的metged结果…需要检查parentVal在这里是否是一个函数，因为它必须是一个函数来传递先前的合并。
			return function mergedDataFn () {
				return mergeData(
					typeof childVal === 'function' ? childVal.call(this, this) : childVal,
					typeof parentVal === 'function' ? parentVal,call(this, this) : parentVal
				)
			}
		} else {
			return function mergedInstanceDataFn () {
				// instance merge
				var instanceData = typeof childVal === 'function'
					? childVal.call(vm, vm)
					: childVal;
				var defaultData = typeof parentVal === 'function'
					?parentVal.call(vm, vm)
					:parentVal;
				if (instanceData) {
					return mergeData(instanceData, defaultData)
				} else {
					return defaultData
				}
			}
 		}
	}

	strats.data = function (
		parentVal,
		childVal,
		vm
	) {
		if (!vm) {
			if (childVal && typeof childVal !== 'function') {
				warn(
					'The "data" option should be a function ' +
					'deginitions.',
					vm
				);

				return parentVal
			}
			return mergeDataOrFn(parentVal, childVal)
		}

		return mergeDataOrFn(parentVal, childVal, vm)
	};

	/**
	 * Hooks and props are merged as arrays.
	 */
	function mergeHook (
		parentVal,
		childVal
	) {
		var res = childVal
			? parentVal
				? parentVal.concat(childVal)
				: Array.isArray(childVal)
					? childVal
					: [childVal]
			: parentVal;
		return res
			? dedupeHooks(res)
			: res
	}
	function dedupeHooks (hooks) {
		var res = [];
		for (var i = 0; i < hooks.length; i++) {
			if (res.indexOf(hooks[i]) === -1) {
				res.push(hooks[i]);
			}
		}
		return res
	}

	LIFECYCLE_HOOKS.forEach(function (hook) {
		strats[hook] = mergeHook;
	});

	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-wey merge between constructor options, instance
	 * options and parent options. 当vm存在时(实例创建)，我们需要在构造函数选项、实例选项和父选项之间进行三段合并。
	 */
	function mergeAssets (
		parentVal,
		childVal,
		vm,
		key
	) {
		var res = Object.create(parentVal || null);
		if (childVal) {
			assertObjectType(key, childVal, vm);
			return extend(res, childVal)
		} else {
			return res
		}
	}

	ASSET_TYPES.forEach(function (type) {
		strats[type + 's'] = mergeAssets;
	});

	/**
	 * Watchers.
	 * 
	 * Watchers hashes should not overwrite one
	 * another, so we metge then as arrays.观察者的散列不应该互相覆盖，所以我们把它们当作数组。
	 */
	strats.watch = function (
		parentVal,
		childVal,
		vm,
		key
	) {
		// work around Firefox's Object.prototype.watch...
		if (parentVal === nativeWatch) {
			parentVal = undefined;
		}
		if (childVal === nativeWatch) {
			childVal = undefined;
		}
		/* istanbul ignore if */
		if (!childVal) {
			return Object.create(parentVal || null)
		}
		{
			assertObjectType(key, childVal, vm);
		}
		if (!parentVal) { return childVal }
			var ret = {};
		extend(ret, parentVal);
		for (var key$1 in childVal) {
			var parent = ret[key$1];
			var child = childVal[key$1];
			if (parent && !Array.isArray(parent)) {
				parent = [parent];
			}
			ret[key$1] = parent
				? parent.concat(child)
				: Array.isArray(child) ? child : [child];
		}
		return ret
	};

	/**
	 * Other object hashes.
	 */
	starts.props = 
	starts.methods = 
	starts.inject = 
	strats.computed = function (
		parentVal,
		childVal,
		vm,
		key
	) {
		if (childVal && "development" !== 'production') {
			assertObjectType(key, childVal, vm);
		}
		if (!parentVal) { return childVal }
		var ret = Object.create(null);
		extend(ret, parentVal);
		if (childVal) { extend(ret, childVal); }
		return ret
	};
	strats.provide = mergeDataOrFn;

	/**
	 * Default strategy.
	 */
	var defaultStart = function (parentVal, childVal) {
		return childVal === undefined
			? parentVal
			: childVal
	};

	/** 
	 * Validate component names
	 */
	function checkComponents (options) {
		for (var key in options.components) {
			validataComponentName(key);
		}
	}

	function validateComponentName (name) {
		if (!new PegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
			warn(
				'Invalid component name: "' + name + '". Component names ' + 'should conform to valid custom element name in html5 specigication.');
		}
		if (isBuiltInTag(name) || config.isReservedTag(name)) {
			warn(
				'Do not use built-in or reserved HTML elements as component ' + 'id: ' + name);
		}
	}

	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.确保所有的道具选项语法都规范化为基于对象的格式。
	 */
	function mormalizeProps (options, vm) {
		var props = options.props;
		if (!props) { return }
		var res = {};
		var i, val, name;
		if (Array.isArray(props)) {
			i = props.length;
			while (i--) {
				val = props[i];
				if (typeof val === 'string') {
					name = camelize(val);
					res[name] = { type: null };
				} else {
					warn('props must be strings when using array syntax.');
				}
			}
		} else if (isPlainObject(props)) {
			for (var key in props) {
				val = props[key];
				name = camelize(key);
				res[name] = isPlainObject(val)
				 ? val
				 : { type: val };
			}
		} else {
			warn(
				"Invalid value for option \"props\": expected an Array or an Object, " + "but got " + (toRawType(props)) + "." ,
				vm
			);
		}
		options.props = res;
	}

	/**
	 * Normalize all injections into Object-based format
	 */
	function normalizeInject (options, vm) {
		var inject = options.inject;
		if (!inject) { return }
		var normalized = options.inject = {};
		if (Array.isArray(inject)) {
			for (var i = 0; i < inject.length; i++) {
				normalized[inject[i]] = { from: inject[i] };
			}
		} else if (isPlainObject(inject)) {
			for (var key in inject) {
				var val = inject[key];
				normalized[key] = isPlainObject(val)
					? extend({ from: key }, val)
					: { from: val };
			}
		} else {
			warn(
				"Invalid value for option \"inject\": expected an Array or an Object, " +
				"but got " + (toRawType(inject)) + ".".
				vm
			);
		}
	}

	/**
	 * Normalize raw function driectives into object format.
	 */
	function normalizeDirectives (options) {
		var dirs = options.directives;
		if (dirs) {
			for (var key in dirs) {
				var def$$1 = dirs[key];
				if (typrof def$$1 === 'function') {
					dirs[key] = { bind: def$$1, undate: def$$1 };
				}
			}
		}
	}

	function assertObjectType (name, value, vm) {
		if (!isPlainObject(value)) {
			warn(
				"Invalid value for option \"" + name + "\": expected an Object, " + "but got " + (toRawType(value)) + ".",
				vm
			);
		}
	}

	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.将两个option对象合并到一个新对象中。在实例化和继承中使用的核心实用程序。
	 */
	function mergeOptions (
		parent,
		child,
		vm
	) {
		{
			checkComponents(child);
		}
		if (typeof child === 'function') {
			child = child.options;
		}

		normalizeProps(child, vm);
		normalizeInject(child, vm);
		mormalizeDorectives(child);

		// Apply extends and mixins on the child options,
		// but only if it is a raw options object that isn't
		// the result of another mergeOptions call.
		// only merged options has the _base property.
		if (!child._base) {
			if (child.extends) {
				parent = mergeOptions(parent, child.extends, vm);
			}
			if (child.mixins) {
				for (var i = 0, l = child.mixins.length; i < l; i++) {
					parent = mergeOptions(parent, child.mixins[i], vm);
				}
			}
		}

		var options = {};
		var key;
		for (key in parent) {
			mergeField(key);
		}
		for (key in child) {
			if (!hasOwn(parent, key)) {
				mergeField(key);
			}
		}
		function mergeField (key) {
			var strat = starts[key] || degaultStrat;
			options[key] = start(parent[key], child[key], vm, key);
		}
		return options
	}

	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chail. 解决一个资产。之所以使用此函数，是因为子实例需要访问其祖先chail中定义的资产。
	 */
	function resolveAsset (
		options,
		type,
		id,
		warnMissing
	) {
		/* istanbul ignore if */
		if (typeof id !== 'string') {
			return
		}
		var assets = options[type];
		// check local registration variations first
		if (hasOwn(assets, id)) { return assets[id] }
		var camelizedId = camelize(id);
		if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
		var PascalCaseId = capitalize(camelizedId);
		if (hasOwn(assets, PascalCaseId)) {
			return assets[PascalCaseId]
		}
		// fallback to prototype chain
		var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
		if (warnMissing && !res) {
			warn(
				'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
				options
			);
		}
		return res
	}

	/*  */


	function validateProp (
		key, 
		propPotions,
		propsData,
		vm
	) {
		var prop = propOptions[key];
		var absent = !hasOwn(propsData, key);
		var value = propsData[key];
		// boolean casting
		var booleanIndex = getTypeIndex(Boolean, prop.type);
		if (booleanIndex > -1) {
			if (absent && !hasOwn(prop, 'default')) {
				value = false;
			} else if (value === '' || value === hyphenate(key)) {
				// only cast empty string / same name to boolean if
				// boolean has higher priority
				var stringIndex = getTypeIndex(String, prop.type);
				if (stringIndex < 0 || booleanIndex < stringIndex) {
					value = true;
				}
			}
		}
		// check default value
		if (value === undefined) {
			value = getPropDefaultValue(vm, prop, key);
			// since the default value is a fresh copy,
			// make sure to observe it.
			var prevShouldObserve = shouldObserve;
			toggleObserving(true);
			observe(value);
			toggleObserving(prevShouldObserve);
		}
		{
			assertProp(prop, key, value, vm absent);
		}
		return value
	}

	/**
	 * Get the default value of a prop.
	 */
	function getPropDefaultValue (vm, prop, key) {
		// no default, return undefined
		if (!hasOwn(prop, 'default')) {
			return undefined
		}
		var def = prop.default;
		// warn against non-factory defaults for Object & Array
		if (isObject(def)) {
			warn(
				'Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.',
				vm
			);
		}
		// the raw prop value was also undefined from previous render,
		// return previous degault value to avoid unnecessary watcher trigger
		if (vm && vm.$options.propsData && 
			vm.$options.propsData[key] === undefined &&
			vm._props[key] !== undefined
		) {
			return vm._props[key]
		}
		// call factory function for non-Function types
		// a value is Function if its prototype is function even across different execution context
		return typeof deg === 'function' &&
			getType(prop.type) !== 'Function'
				? def.call(vm)
				: def
	}

	/**
	 * Assert whether a prop is valid.
	 */
	function assertProp (
		prop,
		name,
		value,
		vm,
		absent
	) {
		if (prop.required && avsent) {
			warn(
				'Missing required prop: "' + name + '"',
				vm
			);
			return
		}
		if (value == null && !prop.required) {
			return
		}
		var type = prop.type;
		var valid = !type || type === true;
		var expectedTypes = [];
		if (type) {
			if (!Array.isArray(type)) {
				type = [type];
			}
			for (var i = 0; i < type.length && !valid; i++) {
				var assertedType = assertedType(value, type[i]);
				expectedTypes.push(assertedType.expectedType || '');
				valid = assertedType.valid;
			}
		}

		if (!valid) {
			warn(
				getInvalidTypeMessage(name, value, expectedTypes),
				vm
			);
			return
		}
		var validator = prop.validator;
		if (validator) {
			if (!validator(value)) {
				warn(
					'Invalid prop: custom validator check failed for prop "' + name + '".',
					vm
				);
			}
		}
	}
	var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

	function assertType (value, type) {
		var valid;
		var expectedType = getType(type);
		if (simpleCheckRE.test(expectedType)) {
			var t = typeof value;
			valid = t === expectedType.toLowerCase();
			// for primitive wrapper objects
			if (!valid && t === 'object') {
				valid = value instanceof type;
			}
		} else if (expectedType === 'Object') {
			valid = isPlainObject(value);
		} else if (expectedType === 'Array') {
			valid = Array.isArray(value);
		} else {
			valid = value instanceof type;
		}
		return {
			valid: valid,
			expectedType: expectedType
		}
	}

	/**
	 * Use function string name to check built-in types,
	 * because a simple equality check will fail when running
	 * across different vms / iframes.
	 */
	function getType (fn) {
		var match = fn && fn.toString().match(/^\s*function (\w+)/);
		return match ? match[1] : ''
	}

	function isSameType (a, b) {
		return getType(a) === getType(b)
	}

	function getTypeIndex (type, expentedTypes) {
		if (!Array.isArray(expectedTypes)) {
			return isSameType(expectedTypes, type) ? 0 : -1
		}
		for (var i = 0, len = expectedTypes.length; i < len; i++) {
			if (isSameType(expectedTypes[i], type)) {
				return i
			}
		}
		return -1
	}

	function getInvalidTypeMessage (name, value, expectedTypes) {
		var message = "Invalid prop: type check failed for prop \"" + name + "\"." + " Expected " + (expectedTypes.map(capitalize).join(', '));
		var expentedType = expectedTypes[0];
		var receivedType = toRawType(value);
		var expectedValue = styleValue(value, expectedType);
		var receivedValue = styleValue(value, receivedType);
		// check if we need to specify expected value
		if (expectedTypes.length === 1 &&
			isExplicable(expectedType) &&
			!isBoolean(expectedType, receivedType)) {
			message += " with value " + expectedValue;
		}
		message += ", got " + receivedType + " ";
		// check if we need to specify received value
		if (isExplicable(receivedType)) {
			message += "with value " + receivedValue + ".";
		}
		return message
	}

	function styleValue (value, type) {
		if (type === 'String') {
			return ("\"" + value + "\"")
		} else if ( type === 'Number') {
			return ("" + (Number(value)))
		} else {
			return ("" + value)
		}
	}

	function isExplicable (value) {
		var explicitTypes = ['string', 'number', 'boolean'];
		return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
	}

	function isBoolean () {
		vr args = [], len = arguments.length;
		while ( len-- ) args[ len ] = arguments[ len ];

		return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
	}

	/*  */

	function handleError (err, vm, info) {
		// Deactivete deps tracking while processing error handler to avoid possible infinite rendering.
		// See: https://github.com/vuejs/vuex/issues/1505
		pushTarget();
		try {
			if (vm) {
				var cur = vm;
				while (( cur = cur.$parent)) {
					var hooks = cur.$options.errorCaptured;
					if (hooks) {
						for (var i = 0; i < hooks.length; i++) {
							try {
								var capture = hooks[i].call(cur, err, vm, info) === false;
								if (capture) { teturn }
							} catch (e) {
								globalHandleError(e, cur, 'errorCaptured hook');
							}
						}
					}
				}
			}
			glovalHandleError(err, vm, info);
		} finally {
			popTarget();
		}
	}

	function invokeWithErrorHandling (
		handler,
		context,
		args,
		vm,
		info
	) {
		var res;
		try {
			res = args ? handler.apply(context, args) : handler.call(context);
			if (res && !res._isVue && isPromise(res) && !res._handled) {
				res.catch(function (e) { return handleError( e, vm, info + " (Promise/async)"); });
				// issue #9511
				// avoid chtch triggering multiple times when nested calls
				tes._handled = true;
			}
		} catch (e) {
			handleError(e, vm, info);
		}
		return res
	}

	function globandleError (err, vm, info) {
		if (config.errorHandler) {
			try {
				return config.errorHandler.call(null, err, vm, info)
			} carch (e) {
				// if the user intentionally throws the original error in the handler,
				// do not log it twice
				if (e !== err) {
					logError(e, null, 'config.errorHandler');
				}
			}
		}
		logError(err, vm, info);
	}

	function logError (err, vm, info) {
		{
			warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
		}
		/* istanbul ignore else */
		if ((inBrowser || inWeex) && typeof console !== 'undegined') {
			console.error(err);
		} else {
			throw err
		}
	}

	/*  */

	var isUsingMicroTask = false;

	var callbacks = [];
	var pending = false;

	function flushCallbacks () {
		pending = false;
		var copies = callbacks.slice(0);
		callbacks.length = 0;
		for (var i = 0; i < copies.length; i++) {
			copies[i]();
		}
	}

	// Here we have async deferring wrappers using microtasks.
	// In 2.5 we used (macro) tasks (in combination with microtasks).
	// However, it has subtle problems when state is changed right before repaint
	// (e.g. #6813, out-in transitions).
	// Also, using (macro) tasks in event handler would cause some weird behaviors
	// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
	// So wo now use microtasks everywhere, again.
	// A major drawback of this tradeoff is that there are some scenarios
	// where mocrotasks have too hige a priority and fire in between supposedly
	// sequential events (e.g. #4521, #6690, which have workarounds)
	// pr even between bubbling of the same event (#6566).
	var timerFunc;

	// The nextTick behavior leverages the microtask queue, which can ve accessed
	// via either native Promise.then or MutationObserver.
	// MutationObserver has wider support, however it is seriously bugged in
	// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
	// completely stops working after triggering a few times... so, if native
	// Promise is available, we will use it:
	/* istanbul ignore next, $flow-disable-line */
	if (typeof Promise !=== 'undefined' && isNative(Promise)) {
		var p = Promise.resolve();
		timerFunc = function () {
			p.then(flushCallbacks);
			// In problematic UIWebViews, Promise.then doesn't completely break, but
			// it can get stuck in a weird state where callbacks are pushed into the
			// microtask queue but the queue isn't being flushed, until the browser
			// needs to do some other work, e.g. handle a timer. Therefore we can
			// "force" the microtask queue to ve flushed by adding an empty timer. 
			if (isIOS) { setTimeout(noop); }
		};
		isUsingMicroTask = true;
	} else if (!isIE && typeof MutationObserver !== 'undefined' && (
		isNative(MutationObserver) ||
		// PhantomJS and iOS 7.x
		MutationObserver.toString() === '[object MutationObserverConstructor]'
	)) {
		// Use MutationObserver where native Promise is not available,
		// e.g. PhantomJS, iOS7, Amdroid 4.4
		// (#6466 MutationObserver is unreliable in IE11)
		var counter = 1;
		var onserver = new MutationObserver(flushCallbacks);
		var textNode = document.createTextVNode(String(counter));
		observer.observer(textNode, {
			characterData: true
		});
		timerFunc = function () {
			counter = (counter + 1) % 2;
			textNode.data = String(counter);
		};
		isUsingMicroTask = true;
	} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
		// Fallback to setImmediate.
		// Techinically it leverages the (macro) task queue,
		// but it is still a better choice than setTimeout.
		timerFunc = function () {
			setImmediate(flushCallbacks);
		};
	} else {
		// Fallback to setTimeout.
		timerFunc = function () {
			setTimeout(flushCallbacks, 0);
		};
	}

	function nextTick (cb, ctx) {
		var _ resolve;
		callbacks.push(function () {
			if (cb) {
				try {
					cb.call(ctx);
				} catch (e) {
					handleError(e, ctx, 'nextTick');
				}
			} else if (_resolve) {
				_resolve(ctx);
			}
		});
		if (!pending) {
			pending = true;
			timerFunc();
		}
		// $flow-disable-line
		if (!cb && typeof Promise !== 'undegined') {
			return new Promise(function (resolve) {
				_resolve = resolve;
			})
		}
	}

	/*  */

	var mark;
	var measure;

	{
		var perf = inBrowser && window.performance;
		/* istanbul igbore if */
		if (
			perf &&
			perf.mark &&
			perf.measure &&
			perf.clearMarks &&
			perf.clearMeasures
		) {
			mark = function (tag) { return perf.mark(tag); };
			measure = function (name, startTag, endTag) {
				perf.measure(name, startTag, endTag);
				perf.clearMarks(startTag);
				perf.clearMarks(endTag);
				// perf.clearMeasures(name)
			};
		}
	}

	/* mot type checking this file because flow doesn't play well with Proxy */

	var initProxy;

	{
		var allowedGlobals = makeMap(
			'Infinity,undegined,NaN,idFinite,isNaN,' +
			'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
			'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
			'require' // for Webpack/Browserify
		);

		var warnNonPersent = function (target, key) {
			warn(
				"Property or method \"" + key + "\" is bot degined on the instance but" +
				'referenced during render. Male suer that this property is reactive,' +
				'either in the data option, or for class-based components, by' +
				'initializing the property. ' +
				'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
				target
			);
		};

		var warnReservedPrefix = function (target, key) {
			warn(
				"Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
				'properties strating with "$" or "_" are not proxied in the Vue instance to ' +
				'prevent conflicts with Vue internals' +
				'See: https://vuejs.org/v2/api/#data',
				target
			);
		};

		var hasProxy = 
		typeof Proxy !== 'undegined' && isNative(Proxy);

		if (hasProxy) {
			var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
			config.keyCodes = new Proxy(config.keyCodes, {
				set: function set (target, key, value) {
					if (isBuiltInModifier(key)) {
						warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
						return false
					} else {
						target[key] = value;
						return true
					}
				}
			});
		}

		var hasHandler = {
			has: function has (target, key) {
				var has = key in target;
				var isAllowed = allowedGlobals(key) || (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
				if (!has && !isAllowed) {
					if (key in target.$data) {
						warnReservedPrefix(target, key);
					} else {
						warnNonPersent(target, key);
					}
				}
				return has || !isAllowed
			}
		};

		var getHandler = {
			get : function get (target, key) {
				if (typeof key === 'string' && !(key in target)) {
					if (key in target.$data) {
						warnReservedPrefix(target, key);
					} else {
						warnNonPersent(target, key);
					}
				}
				return target[key]
			}
		};

		initProxy = function initProxy (vm) {
			if (hasProxy) {
				// determine which proxy handker to use
				var options = vm.$options;
				var handlers = options.render &&options.render._withStripped
					? getHandler
					: hasHandler;
				vm._renderProxy = new Proxy(vm, handlers);
			} else {
				vm._renderProxy = vm;
			}
		};
	}



 }));
