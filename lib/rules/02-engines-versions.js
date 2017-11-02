"use strict";

const Promise = require( "bluebird" );

const path = require( "path" );

module.exports = Promise.method( projectPath => {
	const packageJsonPath = path.resolve( projectPath, "package.json" );
	const packageJson     = require( packageJsonPath );
	return packageJson.engines.node === "^8.9.0" &&
		packageJson.engines.npm === "~5.5.1";
} );
