var del = require( 'del' );

/**
 * Task clean
 * @param  {function} cb Callback
 * @return {function}      Function task
 */
module.exports = function () {
    return function ( cb ) {
        del( 'dist', cb );
    };
};