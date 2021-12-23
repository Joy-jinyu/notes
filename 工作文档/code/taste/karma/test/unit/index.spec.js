// import { add } from './index'
describe("测试简单基本函数", function() {
    it("+1测试", function() {
        assert.equal(add(1), 1)
    });
    it("+2测试", function() {
        assert.equal(add(2), 3)
    });
});