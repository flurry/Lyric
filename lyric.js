/* lyric.js
 * 
 * Javascript Linear Regression implementation using the Sylvester (Vector/Matrix) library.
 * 
 * Example usage:
 * var estimateData = applyModel(estimateInput, buildModel(data));
 *
 * Dependencies:
 * sylvester.js - https://github.com/jcoglan/sylvester
 * jquery.js - http://jquery.com
 * 
 * @author Flurry, Inc. 
 * Copyright 2012 Flurry, Inc. (http://flurry.com)
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// Default degree for the model polynomials
var DEFAULT_POLYNOMIAL_DEGREE = 2;

/** Runs a regression on the input and outputs 
 * 
 * 	@param data - A 2-dimensional array comprised of data[0] the explanatory and data[1] the dependent values
 *  @param degree - (optional) The degree of the polynomial to use to model the data
 *  @returns A 1-dimensional array of the theta values, representing the coefficients of the predictive model
 */
function buildModel(data, degree)
{
	// if the degree is not provided, use the default
	if(!degree) degree = DEFAULT_POLYNOMIAL_DEGREE;
	
	var X = generateInputMatrix(data["x"], degree);
	var y = $M(data["y"]);
	
	var theta = generateTheta(X, y);
	
	return theta;
}

/** Applies a given model (theta) to a set of input values.
 * 
 * 	@param data - A 1-dimensional array comprised of the explanatory values to be estimated
 *  @param theta - The model generated to fit the data (from buildModel())
 *  @param degree - (optional) The degree of the polynomial to use to model the data
 *  @returns A 1-dimensional array of the dependent predictions from the explanatory values
 */
function applyModel(data, theta, degree)
{ 
	// if the degree is not provided, use the default
	if(!degree) degree = DEFAULT_POLYNOMIAL_DEGREE;

	// turn the input into the same form we used for generating theta (or else this won't work)
	var xMatrix = generateInputMatrix(data["x"], degree).transpose();
	
	// multiply by theta to get the predicted y values
	var y = xMatrix.x(theta).transpose();
	
	// combine x and y into a data series
	var dataSeries = new Array();
	for(i=0; i<data['x'].length; i++)
	{
		if(data['label']) // if there are labels use them
			dataSeries[i] = {x : data["label"][i], y : y.e(1,i)};
		else			  // otherwise the x values are fine
			dataSeries[i] = {x : data["x"][i], y : y.e(1,i)};
	}
	
	return dataSeries;
}

/** Generates theta using the Normal Equation. Theta is a matrix of the coefficient values of the linear regression formula
 * chosen to best match the input data.
 * 
 * The Normal Equation is represented in Octave as the following:
 * theta = pinv(X'*X)*X'*y;
 * 
 * @param X An input array of explanatory values representing the x values of the equation
 * @param y The dependent values that X should be determining
 * @returns An array of size X[0].length representing the coefficient values
 */ 
function generateTheta(X, y)
{	
	// Get the transpose of X
	Xt = X.transpose();
	
	// Multiple X by its transpose
	var Xmain = X.x(Xt);
	
	// Get the inverse of the result of multiplying X by its transpose
	var Xinv = Xmain.inverse();

	// Get the transpose of X' times y
	var Atd = X.x(y);
	
	// Theta is the result of the multiplication of both 
	var theta = Xinv.x(Atd);
	
	return theta;
}

/** Generates a linear regression input matrix by taking the input vector and assembling a matrix where each row is that
 * input vector raised to a given power. For example, given the power = 3 the output O will be of the form:
 * O[0] = x^0  i.e. all ones
 * O[1] = x^1  i.e. the same as x
 * O[2] = x^2  i.e. all elements of x squared
 * O[3] = x^3  i.e. all elements of x cubed
 * 
 * @param x An input array representing a vector of values
 * @param power The maximum power of the series to create
 * @returns An array of size [x,power+1] 
 */
function generateInputMatrix(x, power)
{
	var ones = new Array();
	for(i=0;i<x.length;i++)
	{
		ones[i] = 1;
	}
		
	// build the basic input in the form of a 2nd degree polynomial
	var matrixArray = new Array();
	matrixArray[0] = ones;
	matrixArray[1] = x;
	var xMatrix = $M(x);
	matrixArray[2] = matrixPower(xMatrix,2).transpose().elements[0];
	
	// add all degrees beyond 2 that are required
	for(i=3;i<=power;i++)
	{
		matrixArray[i] = matrixPower(xMatrix,i).transpose().elements[0];	// x^n values
	}
	
	var M2 = $M(matrixArray);
	
	return M2;
	
}

/** Raises all elements in the given matrix M to the given power n, such as M[i][j]^n
 * 
 * @param matrix A Matrix object
 * @param power The power that all elements of the input matrix should be raised 
 * @returns A Matrix with all elements having been raised to the specified power
 */
function matrixPower(matrix, power)
{
	
	var result = Matrix.Zero(matrix.rows(), matrix.cols());
	
	for(row=1;row<=matrix.rows(); row++)
	{
		for(col=1;col<=matrix.cols(); col++)
		{
			var value = matrix.e(row, col);
			
			value = Math.pow(value, power);
			
			result.elements[row-1][col-1] = value;
		}
	}
	
	return result;
}


/** 
 * Decomposes a vector data series of the form data[series][n] and transforms it into an ordinal sequence of the form data[ordinal][n]
 * 
 * @param dataSeries A two dimensional array of size 2xN containing the sub arrays data['x'][N] and data['y'][N]
 * @returns {___vectorArray0} A two dimensional array of size 3xN containing the sub arrays data['label'][N] data['x'][N] 
 * 			and data['y'][N] where label is the value of the input series 'x' and 'x' is the ordinal value of the entry. 
 */
function ordinalize(dataSeries)
{
	// Build the new array
	var vectorArray = new Array();
	vectorArray['x'] = new Array();		// this will be the ordinal 
	vectorArray['y'] = new Array();		// this will be the 'y' value of the input
	vectorArray['label'] = new Array(); // this will be the 'x' value of the input
	
	$.each(dataSeries['x'], function(i, item) {
		vectorArray['label'][i] = dataSeries['x'][i];
		vectorArray['x'][i] = i; 		// use the ordinal value of x instead of the actual value
		vectorArray['y'][i] = dataSeries['y'][i];
	});
	
	return vectorArray;
}