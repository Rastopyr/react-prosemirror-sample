'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _prosemirror = require('prosemirror');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
	displayName: 'ProseMirror',
	propTypes: {
		options: _react2.default.PropTypes.object,
		defaultValue: _react2.default.PropTypes.any,
		value: _react2.default.PropTypes.any,
		onChange: _react2.default.PropTypes.func,
		valueLink: _react2.default.PropTypes.shape({
			value: _react2.default.PropTypes.any,
			requestChange: _react2.default.PropTypes.func
		})
	},
	render: function render() {
		return _react2.default.createElement('div', { ref: 'pm' });
	},
	componentWillUpdate: function componentWillUpdate(props) {
		if ('value' in props || 'valueLink' in props) {
			var value = props.value || 'valueLink' in props && props.valueLink.value || '';

			if (value !== this._lastValue) {
				this.pm.setContent(value, props.options.docFormat);
				this._lastValue = value;
			}
		}
	},
	componentWillMount: function componentWillMount() {
		this._lastValue = this.props.value;
		if (this._lastValue === undefined && 'valueLink' in this.props) {
			this._lastValue = this.props.valueLink.value;
		}
		if (this._lastValue === undefined) {
			this._lastValue = this.props.defaultValue;
		}

		var options = Object.assign({ doc: this._lastValue }, this.props.options);
		if (options.doc === undefined || options.doc === null) {
			// We could fall back to an empty string, but that wouldn't work for the json
			// docFormat. Setting docFormat to null allows ProseMirror to use its own
			// default empty document.
			options.doc = null;
			options.docFormat = null;
		}
		this.pm = new _prosemirror.ProseMirror(options);
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		this.refs.pm.appendChild(this.pm.wrapper);
		this.pm.on('change', function () {
			var callback = _this.props.onChange || 'valueLink' in _this.props && _this.props.valueLink.requestChange;

			if (callback) {
				_this._lastValue = _this.pm.getContent(_this.props.options.docFormat);
				callback(_this._lastValue);
			}
		});
	},
	componentDidUpdate: function componentDidUpdate(_ref) {
		var _this2 = this;

		var previous = _ref.options;

		var current = this.props.options;
		Object.keys(current).forEach(function (k) {
			if (current[k] !== previous[k]) {
				try {
					_this2.pm.setOption(k, current[k]);
				} catch (e) {
					console.error(e);
					console.warn('Are you creating "' + k + '" in your render function? If so it will fail the strict equality check.');
				}
			}
		});
	},
	getContent: function getContent() {
		var type = arguments.length <= 0 || arguments[0] === undefined ? this.props.options.docFormat : arguments[0];

		return this.pm.getContent(type);
	}
});