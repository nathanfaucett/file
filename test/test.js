var assert = require("assert"),
    Stream = require("stream"),
    File = require("../src/index");


describe("File", function() {

    describe("new File([options])", function() {
        it("should create a new virtual File", function() {
            assert((new File()) instanceof File);
        });
    });

    describe("#path", function() {
        it("should describe how to access file", function() {
            var file = new File({
                path: "/test/file.js"
            });
            assert.equal(file.path, "/test/file.js");

            file.path = "/dest/file.js";
            assert.deepEqual(file.history, ["/test/file.js", "/dest/file.js"]);
        });
    });

    describe("#contents", function() {
        it("should be the contents of the file", function() {
            var file = new File({
                contents: null
            });
            assert.equal(file.contents, null);
        });
    });

    describe("#isBuffer()", function() {
        it("should determine if file.contents is a Buffer or not", function() {
            assert.equal(
                new File({
                    path: "./test.js",
                    contents: new Buffer("data")
                }).isBuffer(),
                true
            );
            assert.equal(
                new File({
                    path: "./test.js",
                    contents: null
                }).isBuffer(),
                false
            );
        });
    });

    describe("#isStream()", function() {
        it("should determine if file.contents is a Stream or not", function() {
            assert.equal(
                new File({
                    path: "./test.js",
                    contents: new Stream()
                }).isStream(),
                true
            );
            assert.equal(
                new File({
                    path: "./test.js",
                    contents: null
                }).isStream(),
                false
            );
        });
    });

    describe("#isNull()", function() {
        it("should determine if file.contents is a null or not", function() {
            assert.equal(
                new File({
                    path: "./test.js",
                    contents: null
                }).isNull(),
                true
            );
        });
    });
});
