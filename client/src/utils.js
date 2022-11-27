/**
 * Higher-order function for async/await error handling
 * @param {function} fn an async function
 * @returns {function} a function that returns a promise
 */
export const catchErrors = (fn) => {
    return function(...args) {
        return fn(...args).catch((err) => {
            console.error(err);
        });
    };
};