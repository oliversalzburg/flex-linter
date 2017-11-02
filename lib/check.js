#!/usr/bin/env node

"use strict";

const Promise = require( "bluebird" );

const argv        = require( "minimist" )( process.argv.slice( 2 ) );
const log         = require( "fm-log" ).module();
const path        = require( "path" );
const projects    = require( "./projects" );
const rules       = require( "./rules" );

// Pre-seed with longest name currently in set.
require( "fm-log" ).Logger.prefixMaxLength = "core-ui-common-styles".length;

const excludedProjects = [
	"akkorokamui2", "click-to-dial", "gitlab-build-image", "infrastructure", "releases.wiki", "static2"
];

const main = () => {
	if( !argv.debug && !argv.verbose ) {
		require( "fm-log" ).logFactory.require( require( "fm-log" ).LogLevels.INFO );
	}

	return Promise.all( [ rules(), projects( excludedProjects ) ] )
		.spread( ( ruleSet, projectPaths ) => projectPaths
			.map( projectPath => ruleSet.map( rule => { // eslint-disable-line arrow-body-style
				return {
					project : {
						name : path.basename( projectPath ),
						path : projectPath
					},
					rule : rule
				};
			} ) )
			.reduce( ( jobs, job ) => jobs.concat( job ), [] ) )
		.each( job => {
			const jobLog = require( "fm-log" ).module( job.project.name );
			return job.rule( job.project.path )
				.then( pass => {
					if( pass ) {
						jobLog.debug( `✔ ${job.rule.id}` );

					} else {
						jobLog.warn( `✘ ${job.rule.id}` );
					}

					return null;
				} )
				.catch( error => {
					jobLog.error( `☠ ${job.rule.id}: ${error.message}` );
				} );
		} )
		.catch( error => log.error( error ) );
};

if( module.parent ) {
	module.exports = main;

} else {
	main();
}
