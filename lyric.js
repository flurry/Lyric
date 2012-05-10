/* lyric.js
 * 
 * Javascript Linear Regression implementation using the Sylvester (Vector/Matrix) library.
 * 
 * Example usage:
 * var estimateData = applyModel(estimationRange, buildModel(data));
 * 
 */

/* Runs a regression on the input and outputs 
 * 
 * PARAMETERS:
 * 	data - A 2 dimensional array comprised of data[0] the explanatory and data[1] the dependent values
 * RETURN:
 *  A 1 dimensional array of the theta values, representing the coefficients of the predictive model
 */
function buildModel(data)
{
	// take data series format {[x,y]} and turn it into vectors
	var vectors = vectorize(data);
	
	var X = generateInputMatrix(vectors["x"]);
	var y = vectors["y"];

	console.log("Input X");
	console.log(JSON.stringify(X.dimensions()));
	console.log(X.inspect());
	console.log("Input y");
	console.log(JSON.stringify(y.dimensions()));
	
	var theta = generateTheta(X, y);
	
	console.log("Theta");
	console.log(JSON.stringify(theta.dimensions()));
	console.log(theta.inspect());
	
	return theta;
}

// Applies a given model to a set of input values
function applyModel(xSeries, theta)
{ 
	var x = ordinalize(xSeries);
	console.log("x");
	console.log(JSON.stringify(x.dimensions()));
	
	var xMatrix = generateInputMatrix(x).transpose();
	
	var y = xMatrix.x(theta).transpose();
	console.log("y");
	console.log(JSON.stringify(y.dimensions()));
	console.log(y.inspect());
	
	// combine x and y into a data series
	var dataSeries = new Array();
	for(i=0; i<x.cols(); i++)
	{
		dataSeries[i] = {x : xSeries[i], y : y.e(1,i)};
	}

	console.log("result");
	console.log(JSON.stringify(dataSeries));
	
	
	return dataSeries;
}

// Generates theta values using the Normal Equation
function generateTheta(X, y)
{
	// FORMULA: theta = pinv(X'*X)*X'*y;
	
	// Get the transpose of X
	Xt = X.transpose();
	
	// Multiple X by its transpose
	var Xmain = X.x(Xt);
	
	// Get the inverse of the result of multiplying X by its transpose
	var Xinv = Xmain.inverse();

	// Get the transpose of X' times y
	var Atd = X.x(y.transpose());
	
	// Theta is the result of the multiplication of both 
	var theta = Xinv.x(Atd);
	
	return theta;
}

// Generates an input matrix with the appropriate number of coefficients
function generateInputMatrix(x)
{
	var ones = new Array();
	for(i=0;i<x.cols();i++)
	{
		ones[i] = 1;
	}
	
	var M2 = $M( [ones,								// constants
	              x.elements[0], 					// x values
			      matrixPower(x,2).elements[0],		// x^2 values
			      //matrixPower(x,3).elements[0]//,		// x^3 values
			      //matrixPower(x,4).elements[0]		// x^4 values
			 ]);
	
	return M2;
	
}

// Decomposes a data series into a series of vectors
function vectorize(dataSeries)
{
	var xArray = new Array();
	var yArray = new Array();
	
	$.each(dataSeries, function(i, item) {
		xArray[i] = i; // use the ordinal value of x instead of the actual value
		yArray[i] = item.y;
	});

	var vectors = new Array();
	vectors["x"] = Matrix.create([xArray]);
	vectors["y"] = Matrix.create([yArray]);
	
	return vectors;
}

// Decomposes a vector data series into an ordinal sequence
function ordinalize(dataSeries)
{
	var vectorArray = new Array();
	
	$.each(dataSeries, function(i, item) {
		vectorArray[i] = i; // use the ordinal value of x instead of the actual value
	});

	return Matrix.create([vectorArray]);
}

// Raises the given matrix to the given power 
function matrixPower(matrix, power)
{
	
	var result = Matrix.Zero(matrix.rows(), matrix.cols());
	
	for(row=1;row<=matrix.rows(); row++)
	{
		for(col=1;col<=matrix.cols(); col++)
		{
			var value = matrix.e(row, col);
			
			for(i=0;i<power;i++)
			{
				value *= value;
			}
			
			result.elements[row-1][col-1] = value;
		}
	}
	
	return result;
}