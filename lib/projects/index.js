"use strict";

const Promise = require( "bluebird" );

const fs   = Promise.promisifyAll( require( "fs" ) );
const log  = require( "fm-log" ).module();
const path = require( "path" );

/**
 * Returns all paths in the FairManager Projects directory.
 */
module.exports = excludedProjects => {
	const projectsDirectory = path.resolve(
		// This directory
		__dirname,
		// lib
		"..",
		// code-style
		"..",
		// FairManager Projects
		".." );

	log.debug( `Generating list of project paths in '${projectsDirectory}'…` );

	return fs.readdirAsync( projectsDirectory )
		.filter( entry => !excludedProjects.includes( entry ) )
		.map( entry => path.resolve( projectsDirectory, entry ) )
		.filter( entry => fs.statAsync( entry )
			.then( stat => stat.isDirectory() ) )
		.then( entries => entries.sort() );
};
