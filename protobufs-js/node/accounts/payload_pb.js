/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var account_pb = require('./account_pb.js');
var google_protobuf_any_pb = require('google-protobuf/google/protobuf/any_pb.js');
goog.exportSymbol('proto.badgeforce_pb.AnyData', null, global);
goog.exportSymbol('proto.badgeforce_pb.Payload', null, global);
goog.exportSymbol('proto.badgeforce_pb.PayloadAction', null, global);
goog.exportSymbol('proto.badgeforce_pb.StorePublicDataPayload', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.badgeforce_pb.Payload = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.badgeforce_pb.Payload, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.badgeforce_pb.Payload.displayName = 'proto.badgeforce_pb.Payload';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.badgeforce_pb.Payload.prototype.toObject = function(opt_includeInstance) {
  return proto.badgeforce_pb.Payload.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.badgeforce_pb.Payload} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.badgeforce_pb.Payload.toObject = function(includeInstance, msg) {
  var f, obj = {
    action: jspb.Message.getFieldWithDefault(msg, 1, 0),
    data: (f = msg.getData()) && proto.badgeforce_pb.AnyData.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.badgeforce_pb.Payload}
 */
proto.badgeforce_pb.Payload.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.badgeforce_pb.Payload;
  return proto.badgeforce_pb.Payload.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.badgeforce_pb.Payload} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.badgeforce_pb.Payload}
 */
proto.badgeforce_pb.Payload.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.badgeforce_pb.PayloadAction} */ (reader.readEnum());
      msg.setAction(value);
      break;
    case 2:
      var value = new proto.badgeforce_pb.AnyData;
      reader.readMessage(value,proto.badgeforce_pb.AnyData.deserializeBinaryFromReader);
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.badgeforce_pb.Payload.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.badgeforce_pb.Payload.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.badgeforce_pb.Payload} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.badgeforce_pb.Payload.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAction();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getData();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.badgeforce_pb.AnyData.serializeBinaryToWriter
    );
  }
};


/**
 * optional PayloadAction action = 1;
 * @return {!proto.badgeforce_pb.PayloadAction}
 */
proto.badgeforce_pb.Payload.prototype.getAction = function() {
  return /** @type {!proto.badgeforce_pb.PayloadAction} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.badgeforce_pb.PayloadAction} value */
proto.badgeforce_pb.Payload.prototype.setAction = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional AnyData data = 2;
 * @return {?proto.badgeforce_pb.AnyData}
 */
proto.badgeforce_pb.Payload.prototype.getData = function() {
  return /** @type{?proto.badgeforce_pb.AnyData} */ (
    jspb.Message.getWrapperField(this, proto.badgeforce_pb.AnyData, 2));
};


/** @param {?proto.badgeforce_pb.AnyData|undefined} value */
proto.badgeforce_pb.Payload.prototype.setData = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.badgeforce_pb.Payload.prototype.clearData = function() {
  this.setData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.badgeforce_pb.Payload.prototype.hasData = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.badgeforce_pb.AnyData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.badgeforce_pb.AnyData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.badgeforce_pb.AnyData.displayName = 'proto.badgeforce_pb.AnyData';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.badgeforce_pb.AnyData.prototype.toObject = function(opt_includeInstance) {
  return proto.badgeforce_pb.AnyData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.badgeforce_pb.AnyData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.badgeforce_pb.AnyData.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: (f = msg.getData()) && google_protobuf_any_pb.Any.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.badgeforce_pb.AnyData}
 */
proto.badgeforce_pb.AnyData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.badgeforce_pb.AnyData;
  return proto.badgeforce_pb.AnyData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.badgeforce_pb.AnyData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.badgeforce_pb.AnyData}
 */
proto.badgeforce_pb.AnyData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_any_pb.Any;
      reader.readMessage(value,google_protobuf_any_pb.Any.deserializeBinaryFromReader);
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.badgeforce_pb.AnyData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.badgeforce_pb.AnyData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.badgeforce_pb.AnyData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.badgeforce_pb.AnyData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_any_pb.Any.serializeBinaryToWriter
    );
  }
};


/**
 * optional google.protobuf.Any data = 1;
 * @return {?proto.google.protobuf.Any}
 */
proto.badgeforce_pb.AnyData.prototype.getData = function() {
  return /** @type{?proto.google.protobuf.Any} */ (
    jspb.Message.getWrapperField(this, google_protobuf_any_pb.Any, 1));
};


/** @param {?proto.google.protobuf.Any|undefined} value */
proto.badgeforce_pb.AnyData.prototype.setData = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.badgeforce_pb.AnyData.prototype.clearData = function() {
  this.setData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.badgeforce_pb.AnyData.prototype.hasData = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.badgeforce_pb.StorePublicDataPayload = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.badgeforce_pb.StorePublicDataPayload, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.badgeforce_pb.StorePublicDataPayload.displayName = 'proto.badgeforce_pb.StorePublicDataPayload';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.badgeforce_pb.StorePublicDataPayload.prototype.toObject = function(opt_includeInstance) {
  return proto.badgeforce_pb.StorePublicDataPayload.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.badgeforce_pb.StorePublicDataPayload} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.badgeforce_pb.StorePublicDataPayload.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: (f = msg.getData()) && account_pb.Account.PublicData.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.badgeforce_pb.StorePublicDataPayload}
 */
proto.badgeforce_pb.StorePublicDataPayload.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.badgeforce_pb.StorePublicDataPayload;
  return proto.badgeforce_pb.StorePublicDataPayload.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.badgeforce_pb.StorePublicDataPayload} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.badgeforce_pb.StorePublicDataPayload}
 */
proto.badgeforce_pb.StorePublicDataPayload.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new account_pb.Account.PublicData;
      reader.readMessage(value,account_pb.Account.PublicData.deserializeBinaryFromReader);
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.badgeforce_pb.StorePublicDataPayload.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.badgeforce_pb.StorePublicDataPayload.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.badgeforce_pb.StorePublicDataPayload} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.badgeforce_pb.StorePublicDataPayload.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      account_pb.Account.PublicData.serializeBinaryToWriter
    );
  }
};


/**
 * optional Account.PublicData data = 1;
 * @return {?proto.badgeforce_pb.Account.PublicData}
 */
proto.badgeforce_pb.StorePublicDataPayload.prototype.getData = function() {
  return /** @type{?proto.badgeforce_pb.Account.PublicData} */ (
    jspb.Message.getWrapperField(this, account_pb.Account.PublicData, 1));
};


/** @param {?proto.badgeforce_pb.Account.PublicData|undefined} value */
proto.badgeforce_pb.StorePublicDataPayload.prototype.setData = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.badgeforce_pb.StorePublicDataPayload.prototype.clearData = function() {
  this.setData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.badgeforce_pb.StorePublicDataPayload.prototype.hasData = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * @enum {number}
 */
proto.badgeforce_pb.PayloadAction = {
  STOREPUBLICDATA: 0
};

goog.object.extend(exports, proto.badgeforce_pb);
