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

goog.exportSymbol('proto.issuer_pb.AcademicCredential', null, global);
goog.exportSymbol('proto.issuer_pb.Core', null, global);
goog.exportSymbol('proto.issuer_pb.StorageHash', null, global);

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
proto.issuer_pb.AcademicCredential = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.issuer_pb.AcademicCredential, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.issuer_pb.AcademicCredential.displayName = 'proto.issuer_pb.AcademicCredential';
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
proto.issuer_pb.AcademicCredential.prototype.toObject = function(opt_includeInstance) {
  return proto.issuer_pb.AcademicCredential.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.issuer_pb.AcademicCredential} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuer_pb.AcademicCredential.toObject = function(includeInstance, msg) {
  var f, obj = {
    coreInfo: (f = msg.getCoreInfo()) && proto.issuer_pb.Core.toObject(includeInstance, f),
    signature: jspb.Message.getFieldWithDefault(msg, 2, ""),
    storageHash: (f = msg.getStorageHash()) && proto.issuer_pb.StorageHash.toObject(includeInstance, f)
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
 * @return {!proto.issuer_pb.AcademicCredential}
 */
proto.issuer_pb.AcademicCredential.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.issuer_pb.AcademicCredential;
  return proto.issuer_pb.AcademicCredential.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.issuer_pb.AcademicCredential} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.issuer_pb.AcademicCredential}
 */
proto.issuer_pb.AcademicCredential.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.issuer_pb.Core;
      reader.readMessage(value,proto.issuer_pb.Core.deserializeBinaryFromReader);
      msg.setCoreInfo(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSignature(value);
      break;
    case 3:
      var value = new proto.issuer_pb.StorageHash;
      reader.readMessage(value,proto.issuer_pb.StorageHash.deserializeBinaryFromReader);
      msg.setStorageHash(value);
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
proto.issuer_pb.AcademicCredential.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.issuer_pb.AcademicCredential.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.issuer_pb.AcademicCredential} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuer_pb.AcademicCredential.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCoreInfo();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.issuer_pb.Core.serializeBinaryToWriter
    );
  }
  f = message.getSignature();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getStorageHash();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.issuer_pb.StorageHash.serializeBinaryToWriter
    );
  }
};


/**
 * optional Core core_info = 1;
 * @return {?proto.issuer_pb.Core}
 */
proto.issuer_pb.AcademicCredential.prototype.getCoreInfo = function() {
  return /** @type{?proto.issuer_pb.Core} */ (
    jspb.Message.getWrapperField(this, proto.issuer_pb.Core, 1));
};


/** @param {?proto.issuer_pb.Core|undefined} value */
proto.issuer_pb.AcademicCredential.prototype.setCoreInfo = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.issuer_pb.AcademicCredential.prototype.clearCoreInfo = function() {
  this.setCoreInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.issuer_pb.AcademicCredential.prototype.hasCoreInfo = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string signature = 2;
 * @return {string}
 */
proto.issuer_pb.AcademicCredential.prototype.getSignature = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.issuer_pb.AcademicCredential.prototype.setSignature = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional StorageHash storage_hash = 3;
 * @return {?proto.issuer_pb.StorageHash}
 */
proto.issuer_pb.AcademicCredential.prototype.getStorageHash = function() {
  return /** @type{?proto.issuer_pb.StorageHash} */ (
    jspb.Message.getWrapperField(this, proto.issuer_pb.StorageHash, 3));
};


/** @param {?proto.issuer_pb.StorageHash|undefined} value */
proto.issuer_pb.AcademicCredential.prototype.setStorageHash = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.issuer_pb.AcademicCredential.prototype.clearStorageHash = function() {
  this.setStorageHash(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.issuer_pb.AcademicCredential.prototype.hasStorageHash = function() {
  return jspb.Message.getField(this, 3) != null;
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
proto.issuer_pb.StorageHash = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.issuer_pb.StorageHash, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.issuer_pb.StorageHash.displayName = 'proto.issuer_pb.StorageHash';
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
proto.issuer_pb.StorageHash.prototype.toObject = function(opt_includeInstance) {
  return proto.issuer_pb.StorageHash.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.issuer_pb.StorageHash} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuer_pb.StorageHash.toObject = function(includeInstance, msg) {
  var f, obj = {
    hash: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.issuer_pb.StorageHash}
 */
proto.issuer_pb.StorageHash.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.issuer_pb.StorageHash;
  return proto.issuer_pb.StorageHash.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.issuer_pb.StorageHash} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.issuer_pb.StorageHash}
 */
proto.issuer_pb.StorageHash.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setHash(value);
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
proto.issuer_pb.StorageHash.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.issuer_pb.StorageHash.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.issuer_pb.StorageHash} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuer_pb.StorageHash.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string hash = 1;
 * @return {string}
 */
proto.issuer_pb.StorageHash.prototype.getHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.issuer_pb.StorageHash.prototype.setHash = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.issuer_pb.Core = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.issuer_pb.Core, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.issuer_pb.Core.displayName = 'proto.issuer_pb.Core';
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
proto.issuer_pb.Core.prototype.toObject = function(opt_includeInstance) {
  return proto.issuer_pb.Core.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.issuer_pb.Core} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuer_pb.Core.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    school: jspb.Message.getFieldWithDefault(msg, 2, ""),
    issuer: jspb.Message.getFieldWithDefault(msg, 3, ""),
    recipient: jspb.Message.getFieldWithDefault(msg, 4, ""),
    dateEarned: jspb.Message.getFieldWithDefault(msg, 5, ""),
    institutionid: jspb.Message.getFieldWithDefault(msg, 6, ""),
    expiration: jspb.Message.getFieldWithDefault(msg, 7, ""),
    image: jspb.Message.getFieldWithDefault(msg, 8, "")
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
 * @return {!proto.issuer_pb.Core}
 */
proto.issuer_pb.Core.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.issuer_pb.Core;
  return proto.issuer_pb.Core.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.issuer_pb.Core} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.issuer_pb.Core}
 */
proto.issuer_pb.Core.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSchool(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIssuer(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setRecipient(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setDateEarned(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstitutionid(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setExpiration(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setImage(value);
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
proto.issuer_pb.Core.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.issuer_pb.Core.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.issuer_pb.Core} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuer_pb.Core.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSchool();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIssuer();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getRecipient();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getDateEarned();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getInstitutionid();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getExpiration();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getImage();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setName = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string school = 2;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getSchool = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setSchool = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string issuer = 3;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getIssuer = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setIssuer = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string recipient = 4;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getRecipient = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setRecipient = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string date_earned = 5;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getDateEarned = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setDateEarned = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string institutionId = 6;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getInstitutionid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setInstitutionid = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string expiration = 7;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getExpiration = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setExpiration = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string image = 8;
 * @return {string}
 */
proto.issuer_pb.Core.prototype.getImage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/** @param {string} value */
proto.issuer_pb.Core.prototype.setImage = function(value) {
  jspb.Message.setProto3StringField(this, 8, value);
};


goog.object.extend(exports, proto.issuer_pb);
