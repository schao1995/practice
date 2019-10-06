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
			} else if ( !isObjectA && !isObjectB) {
				return String(a) === String(b)
			} else {
				return false
			}
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
}));
