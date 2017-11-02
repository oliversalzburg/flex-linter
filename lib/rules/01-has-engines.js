"use strict";

const Promise = require( "bluebird" );

const path = require( "path" );

module.exports = Promise.method( projectPath => {
	const packageJsonPath = path.resolve( projectPath, "package.json" );
	const packageJson     = require( packageJsonPath );
	return packageJson.engines &&
		packageJson.engines.node && packageJson.engines.node;
} );
