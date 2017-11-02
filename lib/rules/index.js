"use strict";

const Promise = require( "bluebird" );

const fs   = Promise.promisifyAll( require( "fs" ) );
const log  = require( "fm-log" ).module();
const path = require( "path" );

/**
 * Returns all rule check functions defined through modules in the `rules` directory of this project.
 */
module.exports = () => {
	const rulesDirectory = __dirname;

	log.debug( `Consuming rule definitions in '${rulesDirectory}'…` );

	return fs.readdirAsync( rulesDirectory )
		.map( entry => path.resolve( rulesDirectory, entry ) )
		.filter( entry => fs.statAsync( entry )
			.then( stat => stat.isFile() && entry.endsWith( ".js" ) && path.basename( entry ) !== "index.js" ) )
		.then( entries => entries.sort() )
		.map( modulePath => {
			log.debug( `Loading '${modulePath}'…` );
			const ruleFunction = require( modulePath );
			ruleFunction.id = path
				// Cut off absolute path
				.basename( modulePath )
				// Remove suffix
				.replace( /\.js$/, "" )
				// Remove ordering prefix
				.replace( /^\d\d-/, "" );
			return ruleFunction;
		} );
};
