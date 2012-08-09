Lyric
=====

Linear Regression library in pure Javascript

Lyric can help you analyze any set of x,y series data by building a model that can be used to:
1. Create trendlines on charts
2. Predict future values based on an existing set of data

Typical applications would include charting libraries and machine learning applications. 

Lyric depends on the great Javascript Matrix library Sylvester by James Coglan available here: 
https://github.com/jcoglan/sylvester
and the JQuery library available here: http://jquery.com/

Usage
=====

Download the lyric.js, jquery-X.X.X.js and sylvester.js files and include them in your web application. 

Include both the lyric.js and the sylvester.js files as shown below:  
&lt;script type="text/javascript" src="js/jquery-X.X.X.js"&gt;&lt;/script&gt;<br/>
&lt;script type="text/javascript" src="js/sylvester.js"&gt;&lt;/script&gt;<br/>
&lt;script type="text/javascript" src="js/lyric.js"&gt;&lt;/script&gt;
	
First, make sure your data is represented in the form of a 2xN Array comprised of elements with an 'x' and 'y' value. The x value should be the explanatory and the y the dependent variables.
<!-- language: lang-js -->
	var input = new Array();
	input['x'][0] = 1;		input['y'][0] = 0.5;
	input['x'][1] = 2;		input['y'][1] = 1.6;	
	input['x'][2] = 3;		input['y'][2] = 4.5;
	input['x'][3] = 4;		input['y'][3] = 7.6;
	input['x'][4] = 5;		input['y'][4] = 10.1;
	
Then you need to have Lyric build the model for you from your data:
<!-- language: lang-js -->
	var model = buildModel(input);

Now that you have your model, you will likely want to apply it to a set of inputs. The newInput should be a 1xN array containing only the explanatory variable values you would like to calculate the dependent values. This will result in a new 2xN array which will include the resulting series. 
<!-- language: lang-js -->
	var data = applyModel(model, estimationInput);

The following is a complete example which, given some values for the explanatory values 1 through 5, estimates the values of 6 through 8:
<!-- language: lang-js -->
	var input = new Array();
	input['x'][0] = 1;		input['y'][0] = 0.5;
	input['x'][1] = 2;		input['y'][1] = 1.6;	
	input['x'][2] = 3;		input['y'][2] = 4.5;
	input['x'][3] = 4;		input['y'][3] = 7.6;
	input['x'][4] = 5;		input['y'][4] = 10.1;
	
	var estimationInput = new Array();
	estimationInput['x'][0] = 6;
	estimationInput['x'][1] = 7;
	estimationInput['x'][2] = 8;

	var estimateData = applyModel(estimationInput, buildModel(data));
	
By default Lyric will attempt to use a 2nd degree polynomial to model the data. If you would like to use a higher order polynomial for the model, just pass in the degree you would like to use in the buildModel() and applyModel() functions. 
For example, to model using a 4-th degree polynomial you would modify the above example as follows:
<!-- language: lang-js -->
	var estimateData = applyModel(estimationInput, buildModel(data, 4), 4);
	
Timeseries
=====
For timeseries data using regular intervals, it is typically more efficient to use the ordinality as the explanatory value than the timestamp. For example, given the following data series:
<!-- language: lang-js -->
	var input = new Array();
	input['x'][0] = '2012-03-01';		input['y'][0] = 0.5;
	input['x'][1] = '2012-03-02';		input['y'][1] = 1.6;	
	input['x'][2] = '2012-03-03';		input['y'][2] = 4.5;
	input['x'][3] = '2012-03-04';		input['y'][3] = 7.6;
	input['x'][4] = '2012-03-05';		input['y'][4] = 10.1;
	
You can turn the dates in the input[0] series into timestamps for use in modelling, but since each data point represents a single day the easier and simpler calculation is to ignore the particular days and use the ordinality. Lyric provides a convenience function for manipulating this kind of data called ordinalize() which is used as shown below:
<!-- language: lang-js -->
	var ordinalInput = ordinalize(input);
	
The resulting ordinalInput will be equivalent to having created the following input:
<!-- language: lang-js -->
	var input = new Array();
	input['label'][0] = '2012-03-01';		input['x'][0] = 1;		input['y'][0] = 0.5;
	input['label'][1] = '2012-03-01';		input['x'][1] = 2;		input['y'][1] = 1.6;	
	input['label'][2] = '2012-03-01';		input['x'][2] = 3;		input['y'][2] = 4.5;
	input['label'][3] = '2012-03-01';		input['x'][3] = 4;		input['y'][3] = 7.6;
	input['label'][4] = '2012-03-01';		input['x'][4] = 5;		input['y'][4] = 10.1;
	
Lyric can then use the ordinal x values to more efficiently compute the regression. Note that if you do use this, you need to ordinalize both the input provided to build the model AND the input the model is applied.
	
Implementation
=====
Lyric uses the Normal Equation (closed form) to build the linear model. You can read more about the Normal Equation here:
http://mathworld.wolfram.com/NormalEquation.html

This does introduce the limitation that Lyric will not work on input data that produces a non-invertible matrix when multiplied by its transpose. 

A full breakdown on Lyric is available here: http://tech.flurry.com/lyric-linear-regression-in-pure-javascript

License 
=====
Copyright 2012 Flurry, Inc. (http://flurry.com)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.