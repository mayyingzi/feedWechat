export const restoreSpy = (obj, method) => {
    if (obj[method] && obj[method].restore) {
        obj[method].restore();
    }
};
/**
 * 测试action方法
 * 从 http://vuex.vuejs.org/zh-cn/testing.html 测试 Actions 部分获取
 * @param action {Function} 需要测试的action方法
 * @param args   {Array}    action方法的参数
 * @param state  {Object}   state object
 * @param expectedMutations {Array} 对应每个args参数的期待结果
 * @param done {Function} chai的done方法
 */
export const testAction = (action, args, state, expectedMutations, done) => {
    let count = 0;

    const commit = (type, payload) => {
        const mutation = expectedMutations[count];

        expect(mutation.type).to.equal(type);
        // console.log('type', type);
        // console.log('mutation.type', mutation.type);
        // console.log('======================');

        if (payload) {
            // console.log('payload', payload);
            // console.log('mutation.payload', mutation.payload);
            // console.log('======================');
            expect(mutation.payload).to.deep.equal(payload);
        }

        count++;

        if (count >= expectedMutations.length) {
            done();
        }
    };

    const actionFun = action({ commit, state }, ...args);

    if (actionFun && actionFun.then
        && typeof actionFun.then === 'function') {
        actionFun.then((res) => {
            done(res);
        })
        .catch((err) => {
            done(err);
        });
    }

    if (expectedMutations.length === 0) {
        expect(count).to.equal(0);
        done();
    }
};
