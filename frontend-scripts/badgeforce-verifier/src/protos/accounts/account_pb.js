/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.badgeforce_pb = (function() {

    /**
     * Namespace badgeforce_pb.
     * @exports badgeforce_pb
     * @namespace
     */
    var badgeforce_pb = {};

    badgeforce_pb.Account = (function() {

        /**
         * Properties of an Account.
         * @memberof badgeforce_pb
         * @interface IAccount
         * @property {string|null} [publicKey] Account publicKey
         * @property {badgeforce_pb.Account.IPublicData|null} [publicData] Account publicData
         */

        /**
         * Constructs a new Account.
         * @memberof badgeforce_pb
         * @classdesc Represents an Account.
         * @implements IAccount
         * @constructor
         * @param {badgeforce_pb.IAccount=} [properties] Properties to set
         */
        function Account(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Account publicKey.
         * @member {string} publicKey
         * @memberof badgeforce_pb.Account
         * @instance
         */
        Account.prototype.publicKey = "";

        /**
         * Account publicData.
         * @member {badgeforce_pb.Account.IPublicData|null|undefined} publicData
         * @memberof badgeforce_pb.Account
         * @instance
         */
        Account.prototype.publicData = null;

        /**
         * Creates a new Account instance using the specified properties.
         * @function create
         * @memberof badgeforce_pb.Account
         * @static
         * @param {badgeforce_pb.IAccount=} [properties] Properties to set
         * @returns {badgeforce_pb.Account} Account instance
         */
        Account.create = function create(properties) {
            return new Account(properties);
        };

        /**
         * Encodes the specified Account message. Does not implicitly {@link badgeforce_pb.Account.verify|verify} messages.
         * @function encode
         * @memberof badgeforce_pb.Account
         * @static
         * @param {badgeforce_pb.IAccount} message Account message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Account.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.publicKey);
            if (message.publicData != null && message.hasOwnProperty("publicData"))
                $root.badgeforce_pb.Account.PublicData.encode(message.publicData, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Account message, length delimited. Does not implicitly {@link badgeforce_pb.Account.verify|verify} messages.
         * @function encodeDelimited
         * @memberof badgeforce_pb.Account
         * @static
         * @param {badgeforce_pb.IAccount} message Account message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Account.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Account message from the specified reader or buffer.
         * @function decode
         * @memberof badgeforce_pb.Account
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {badgeforce_pb.Account} Account
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Account.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.badgeforce_pb.Account();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.publicKey = reader.string();
                    break;
                case 2:
                    message.publicData = $root.badgeforce_pb.Account.PublicData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Account message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof badgeforce_pb.Account
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {badgeforce_pb.Account} Account
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Account.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Account message.
         * @function verify
         * @memberof badgeforce_pb.Account
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Account.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                if (!$util.isString(message.publicKey))
                    return "publicKey: string expected";
            if (message.publicData != null && message.hasOwnProperty("publicData")) {
                var error = $root.badgeforce_pb.Account.PublicData.verify(message.publicData);
                if (error)
                    return "publicData." + error;
            }
            return null;
        };

        /**
         * Creates an Account message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof badgeforce_pb.Account
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {badgeforce_pb.Account} Account
         */
        Account.fromObject = function fromObject(object) {
            if (object instanceof $root.badgeforce_pb.Account)
                return object;
            var message = new $root.badgeforce_pb.Account();
            if (object.publicKey != null)
                message.publicKey = String(object.publicKey);
            if (object.publicData != null) {
                if (typeof object.publicData !== "object")
                    throw TypeError(".badgeforce_pb.Account.publicData: object expected");
                message.publicData = $root.badgeforce_pb.Account.PublicData.fromObject(object.publicData);
            }
            return message;
        };

        /**
         * Creates a plain object from an Account message. Also converts values to other types if specified.
         * @function toObject
         * @memberof badgeforce_pb.Account
         * @static
         * @param {badgeforce_pb.Account} message Account
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Account.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.publicKey = "";
                object.publicData = null;
            }
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = message.publicKey;
            if (message.publicData != null && message.hasOwnProperty("publicData"))
                object.publicData = $root.badgeforce_pb.Account.PublicData.toObject(message.publicData, options);
            return object;
        };

        /**
         * Converts this Account to JSON.
         * @function toJSON
         * @memberof badgeforce_pb.Account
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Account.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * EntityType enum.
         * @name badgeforce_pb.Account.EntityType
         * @enum {string}
         * @property {number} PERSON=0 PERSON value
         * @property {number} ORGANIZATION=1 ORGANIZATION value
         */
        Account.EntityType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "PERSON"] = 0;
            values[valuesById[1] = "ORGANIZATION"] = 1;
            return values;
        })();

        Account.PublicData = (function() {

            /**
             * Properties of a PublicData.
             * @memberof badgeforce_pb.Account
             * @interface IPublicData
             * @property {string|null} [number] PublicData number
             * @property {string|null} [dateOfBirth] PublicData dateOfBirth
             * @property {string|null} [address] PublicData address
             * @property {string|null} [photo] PublicData photo
             * @property {string|null} [url] PublicData url
             * @property {string|null} [name] PublicData name
             * @property {badgeforce_pb.Account.EntityType|null} [type] PublicData type
             */

            /**
             * Constructs a new PublicData.
             * @memberof badgeforce_pb.Account
             * @classdesc Represents a PublicData.
             * @implements IPublicData
             * @constructor
             * @param {badgeforce_pb.Account.IPublicData=} [properties] Properties to set
             */
            function PublicData(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PublicData number.
             * @member {string} number
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             */
            PublicData.prototype.number = "";

            /**
             * PublicData dateOfBirth.
             * @member {string} dateOfBirth
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             */
            PublicData.prototype.dateOfBirth = "";

            /**
             * PublicData address.
             * @member {string} address
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             */
            PublicData.prototype.address = "";

            /**
             * PublicData photo.
             * @member {string} photo
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             */
            PublicData.prototype.photo = "";

            /**
             * PublicData url.
             * @member {string} url
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             */
            PublicData.prototype.url = "";

            /**
             * PublicData name.
             * @member {string} name
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             */
            PublicData.prototype.name = "";

            /**
             * PublicData type.
             * @member {badgeforce_pb.Account.EntityType} type
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             */
            PublicData.prototype.type = 0;

            /**
             * Creates a new PublicData instance using the specified properties.
             * @function create
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {badgeforce_pb.Account.IPublicData=} [properties] Properties to set
             * @returns {badgeforce_pb.Account.PublicData} PublicData instance
             */
            PublicData.create = function create(properties) {
                return new PublicData(properties);
            };

            /**
             * Encodes the specified PublicData message. Does not implicitly {@link badgeforce_pb.Account.PublicData.verify|verify} messages.
             * @function encode
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {badgeforce_pb.Account.IPublicData} message PublicData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PublicData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.number != null && message.hasOwnProperty("number"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.number);
                if (message.dateOfBirth != null && message.hasOwnProperty("dateOfBirth"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.dateOfBirth);
                if (message.address != null && message.hasOwnProperty("address"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.address);
                if (message.photo != null && message.hasOwnProperty("photo"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.photo);
                if (message.url != null && message.hasOwnProperty("url"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.url);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.type);
                return writer;
            };

            /**
             * Encodes the specified PublicData message, length delimited. Does not implicitly {@link badgeforce_pb.Account.PublicData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {badgeforce_pb.Account.IPublicData} message PublicData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PublicData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PublicData message from the specified reader or buffer.
             * @function decode
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {badgeforce_pb.Account.PublicData} PublicData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PublicData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.badgeforce_pb.Account.PublicData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.number = reader.string();
                        break;
                    case 2:
                        message.dateOfBirth = reader.string();
                        break;
                    case 3:
                        message.address = reader.string();
                        break;
                    case 4:
                        message.photo = reader.string();
                        break;
                    case 5:
                        message.url = reader.string();
                        break;
                    case 6:
                        message.name = reader.string();
                        break;
                    case 7:
                        message.type = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PublicData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {badgeforce_pb.Account.PublicData} PublicData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PublicData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PublicData message.
             * @function verify
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PublicData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.number != null && message.hasOwnProperty("number"))
                    if (!$util.isString(message.number))
                        return "number: string expected";
                if (message.dateOfBirth != null && message.hasOwnProperty("dateOfBirth"))
                    if (!$util.isString(message.dateOfBirth))
                        return "dateOfBirth: string expected";
                if (message.address != null && message.hasOwnProperty("address"))
                    if (!$util.isString(message.address))
                        return "address: string expected";
                if (message.photo != null && message.hasOwnProperty("photo"))
                    if (!$util.isString(message.photo))
                        return "photo: string expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };

            /**
             * Creates a PublicData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {badgeforce_pb.Account.PublicData} PublicData
             */
            PublicData.fromObject = function fromObject(object) {
                if (object instanceof $root.badgeforce_pb.Account.PublicData)
                    return object;
                var message = new $root.badgeforce_pb.Account.PublicData();
                if (object.number != null)
                    message.number = String(object.number);
                if (object.dateOfBirth != null)
                    message.dateOfBirth = String(object.dateOfBirth);
                if (object.address != null)
                    message.address = String(object.address);
                if (object.photo != null)
                    message.photo = String(object.photo);
                if (object.url != null)
                    message.url = String(object.url);
                if (object.name != null)
                    message.name = String(object.name);
                switch (object.type) {
                case "PERSON":
                case 0:
                    message.type = 0;
                    break;
                case "ORGANIZATION":
                case 1:
                    message.type = 1;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a PublicData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof badgeforce_pb.Account.PublicData
             * @static
             * @param {badgeforce_pb.Account.PublicData} message PublicData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PublicData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.number = "";
                    object.dateOfBirth = "";
                    object.address = "";
                    object.photo = "";
                    object.url = "";
                    object.name = "";
                    object.type = options.enums === String ? "PERSON" : 0;
                }
                if (message.number != null && message.hasOwnProperty("number"))
                    object.number = message.number;
                if (message.dateOfBirth != null && message.hasOwnProperty("dateOfBirth"))
                    object.dateOfBirth = message.dateOfBirth;
                if (message.address != null && message.hasOwnProperty("address"))
                    object.address = message.address;
                if (message.photo != null && message.hasOwnProperty("photo"))
                    object.photo = message.photo;
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.badgeforce_pb.Account.EntityType[message.type] : message.type;
                return object;
            };

            /**
             * Converts this PublicData to JSON.
             * @function toJSON
             * @memberof badgeforce_pb.Account.PublicData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PublicData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return PublicData;
        })();

        return Account;
    })();

    return badgeforce_pb;
})();

module.exports = $root;
