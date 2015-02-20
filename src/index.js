var isNull = require("is_null"),
    isArray = require("is_array"),
    isString = require("is_string"),
    isObject = require("is_object"),
    isFunction = require("is_function");


module.exports = File;


function File(options) {
    options = options || {};

    this.history = (isArray(options.history) ? options.history : (isString(options.path) ? [options.path] : []));
    this.__contents = isContents(options.contents) ? options.contents : null;
}
File.prototype.constructor = File;

File.prototype.clone = function() {
    return (new this.constructor()).copy(this);
};

File.prototype.copy = function(file) {

    this.history = file.history.slice();
    this.__contents = file.__contents;

    return this;
};

File.prototype.isBuffer = function() {
    return Buffer.isBuffer(this.__contents);
};

File.prototype.isStream = function() {
    return isStream(this.__contents);
};

File.prototype.isNull = function() {
    return isNull(this.__contents);
};

File.prototype.pipe = function(stream, options) {
    options = options || {};
    options.end = options.end != null ? !!options.end : true;

    if (this.isStream()) {
        return this.__contents.pipe(stream, options);
    } else if (this.isBuffer()) {
        if (options.end === true) {
            stream.end(this.__contents);
            return stream;
        } else {
            stream.write(this.__contents);
            return stream;
        }
    } else {
        if (options.end === true) {
            stream.end();
            return stream;
        } else {
            return stream;
        }
    }
};

File.prototype.inspect = function() {
    var inspect = [],
        filePath = this.path;

    if (filePath) {
        inspect[inspect.length] = '"' + filePath + '"';
    }

    if (this.isBuffer()) {
        inspect[inspect.length] = this.__contents.inspect();
    } else if (this.isStream()) {
        inspect[inspect.length] = inspectStream(this.__contents);
    }

    return "<File " + inspect.join(" ") + ">";
};

Object.defineProperty(File.prototype, "contents", {
    get: function() {
        return this.__contents;
    },
    set: function(value) {
        if (isContents(value)) {
            this.__contents = value;
        } else {
            throw new TypeError("File.contents can only be a Buffer, a Stream, or null.");
        }
    }
});

Object.defineProperty(File.prototype, "path", {
    get: function() {
        var history = this.history;
        return history[history.length - 1];
    },
    set: function(value) {
        var history, length, path;

        if (!isString(value)) {
            throw new TypeError("path should be a string");
        } else {
            history = this.history;
            length = history.length;
            path = history[length - 1];

            if (value && value !== path) {
                history[length] = value;
            }
        }
    }
});

function isContents(value) {
    return Buffer.isBuffer(value) || isStream(value) || isNull(value);
}

function isStream(obj) {
    return isObject(obj) && isFunction(obj.pipe);
}

function inspectStream(stream) {
    var streamType;

    if (!isStream(stream)) {
        return "";
    } else {
        streamType = stream.constructor.name;
        return "<" + (streamType !== "Stream" ? streamType : "") + "Stream>";
    }
}
