'use strict';

var _ = require('underscore');

var buildJsonInCondition = function(builder, field, operator, value) {
	field = builder.dialect._wrapIdentifier(field);

	var placeholder = builder._pushValue(JSON.stringify(value));

	return [field, operator, placeholder].join(' ');
};

// Compare conditions (e.g. $eq, $gt)
var buildCompareCondition = function(builder, field, operator, value) {
	var placeholder;

	// if value is object, than make field block from it
	if (value && _.isObject(value)) {
		placeholder = builder.buildBlock('field', value);
	} else {
		// if value is simple - create placeholder for it
		placeholder = builder._pushValue(value);
	}

	field = builder.dialect._wrapIdentifier(field);
	return [field, operator, placeholder].join(' ');
};

var buildJsonHasCondition = function(builder, field, operator, value) {
	field = builder.dialect._wrapIdentifier(field);

	var placeholder;
	if (_(value).isArray()) {
		placeholder = 'array[' + _(value).map(function(item) {
			return builder._pushValue(item);
		}).join(', ') + ']';
	} else {
		placeholder = builder._pushValue(value);
	}

	return [field, operator, placeholder].join(' ');
};

module.exports = function(dialect) {
	dialect.conditions.add('$jsonContains', function(field, operator, value) {
		return buildJsonInCondition(this, field, '@>', value);
	});

	dialect.conditions.add('$jsonIn', function(field, operator, value) {
		return buildJsonInCondition(this, field, '<@', value);
	});

	dialect.conditions.add('$jsonHas', function(field, operator, value) {
		return buildJsonHasCondition(this, field, '?', value.toString());
	});

	dialect.conditions.add('$jsonHasAny', function(field, operator, value) {
		return buildJsonHasCondition(this, field, '?|', value);
	});

	dialect.conditions.add('$jsonHasAll', function(field, operator, value) {
		return buildJsonHasCondition(this, field, '?&', value);
	});

	dialect.conditions.add('$ilike', function(field, operator, value) {
		return buildCompareCondition(this, field, 'ilike', value);
	});
};
