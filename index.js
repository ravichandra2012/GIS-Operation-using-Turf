var jsts = require('jsts');

var fs = require('fs');
var fileList = [];

// Read Geojson files in Working Directory and fileList
const testFolder = '../sync/';

var turf = require('@turf/turf');
var geojsonArea = require('@mapbox/geojson-area');

var natural = require('natural');

function calcIntersectPerc(poly1,intersection)
{
	// Intersection of two GIS Polygons
	var area_intersection = geojsonArea.geometry(intersection.geometry);
	var area_poly1        = geojsonArea.geometry(poly1.geometry);

	// Calculating percentage of overlap of two polygons
	return ((area_intersection / area_poly1)*100);
}

fs.readdir(testFolder, (err, files) => {
  
	// Find geojson files
	files.forEach(file => {
	if(file.endsWith('.geojson')) {
		fileList.push(file);
	}
	});

	// Compare each of the geojson files
	for (var i = 0; i < fileList.length; i++) 
	{
		for (var j = i + 1; j < fileList.length; j++) 
		{
			var poly1 = JSON.parse(fs.readFileSync(testFolder + '/' + fileList[i], 'utf8'));
			var poly2 = JSON.parse(fs.readFileSync(testFolder + '/' + fileList[j], 'utf8'));
			var intersection = turf.intersect(poly1, poly2);

			//console.warn(poly1.geometry.coordinates);
	    	var b_poly1 = turf.buffer(poly1, 10, 'kilometers');
	    	
	    	console.warn(calcIntersectPerc(poly1, poly2));
	    	var inside = true;
			

	    	for ( var k = 0 ; k < poly2.geometry.coordinates.length ; k++)
	    	{
	    		point = turf.point(poly2.geometry.coordinates[0][k]);
			    if (!turf.inside(point, poly1)){
			      console.warn("Oh no! "+ point + " isn't in polygon");
			      inside = false;
			    }
			  	console.warn("Child polygon inside parent polygon ? " + inside);
				console.warn(point);
	   //  		console.warn(poly2.geometry.coordinates[0][0]);
	    		//console.warn(turf.within(points,b_poly1));
	    	}

		}	
	}
})