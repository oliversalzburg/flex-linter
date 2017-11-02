"use strict";

const Promise = require( "bluebird" );

const fs   = Promise.promisifyAll( require( "fs" ) );
const path = require( "path" );

module.exports = Promise.method( projectPath => {
	const packageJsonPath = path.resolve( projectPath, "package.json" );
	return fs.statAsync( packageJsonPath )
		.then( () => true )
		.catch( () => false );
} );
