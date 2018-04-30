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

var issuer_common_pb = require('../issuer/common_pb.js');
goog.exportSymbol('proto.issuance_pb.Issuance', null, global);

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
proto.issuance_pb.Issuance = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.issuance_pb.Issuance, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.issuance_pb.Issuance.displayName = 'proto.issuance_pb.Issuance';
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
proto.issuance_pb.Issuance.prototype.toObject = function(opt_includeInstance) {
  return proto.issuance_pb.Issuance.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.issuance_pb.Issuance} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuance_pb.Issuance.toObject = function(includeInstance, msg) {
  var f, obj = {
    signature: jspb.Message.getFieldWithDefault(msg, 1, ""),
    issuerPublicKey: jspb.Message.getFieldWithDefault(msg, 2, ""),
    recipientPublicKey: jspb.Message.getFieldWithDefault(msg, 3, ""),
    proofOfIntegrityHash: (f = msg.getProofOfIntegrityHash()) && issuer_common_pb.ProofOfIntegrity.toObject(includeInstance, f)
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
 * @return {!proto.issuance_pb.Issuance}
 */
proto.issuance_pb.Issuance.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.issuance_pb.Issuance;
  return proto.issuance_pb.Issuance.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.issuance_pb.Issuance} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.issuance_pb.Issuance}
 */
proto.issuance_pb.Issuance.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSignature(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setIssuerPublicKey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setRecipientPublicKey(value);
      break;
    case 7:
      var value = new issuer_common_pb.ProofOfIntegrity;
      reader.readMessage(value,issuer_common_pb.ProofOfIntegrity.deserializeBinaryFromReader);
      msg.setProofOfIntegrityHash(value);
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
proto.issuance_pb.Issuance.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.issuance_pb.Issuance.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.issuance_pb.Issuance} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.issuance_pb.Issuance.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSignature();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getIssuerPublicKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRecipientPublicKey();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getProofOfIntegrityHash();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      issuer_common_pb.ProofOfIntegrity.serializeBinaryToWriter
    );
  }
};


/**
 * optional string signature = 1;
 * @return {string}
 */
proto.issuance_pb.Issuance.prototype.getSignature = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.issuance_pb.Issuance.prototype.setSignature = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string issuer_public_key = 2;
 * @return {string}
 */
proto.issuance_pb.Issuance.prototype.getIssuerPublicKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.issuance_pb.Issuance.prototype.setIssuerPublicKey = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string recipient_public_key = 3;
 * @return {string}
 */
proto.issuance_pb.Issuance.prototype.getRecipientPublicKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.issuance_pb.Issuance.prototype.setRecipientPublicKey = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional issuer_pb.ProofOfIntegrity proof_of_integrity_hash = 7;
 * @return {?proto.issuer_pb.ProofOfIntegrity}
 */
proto.issuance_pb.Issuance.prototype.getProofOfIntegrityHash = function() {
  return /** @type{?proto.issuer_pb.ProofOfIntegrity} */ (
    jspb.Message.getWrapperField(this, issuer_common_pb.ProofOfIntegrity, 7));
};


/** @param {?proto.issuer_pb.ProofOfIntegrity|undefined} value */
proto.issuance_pb.Issuance.prototype.setProofOfIntegrityHash = function(value) {
  jspb.Message.setWrapperField(this, 7, value);
};


proto.issuance_pb.Issuance.prototype.clearProofOfIntegrityHash = function() {
  this.setProofOfIntegrityHash(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.issuance_pb.Issuance.prototype.hasProofOfIntegrityHash = function() {
  return jspb.Message.getField(this, 7) != null;
};


goog.object.extend(exports, proto.issuance_pb);
