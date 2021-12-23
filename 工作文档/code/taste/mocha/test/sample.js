const chai = require("chai")
const { assert, expect } = chai
const should = chai.should()

describe("A sample test", () => {
    it("Test Array includes", () => {
        assert.strictEqual([1, 2, 3].indexOf(4), -1)
    })
    it("Test expect", () => {
        expect('bar').to.be.a('string')
        expect('bar').to.equal('bar')
        expect('bar').to.have.lengthOf(3)
        expect([1, 2, 3], `it's allow channle`).to.have.property(2).with.to.be.a('number')
        'bar'.should.to.be.a('string')
    })
})