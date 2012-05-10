Lyric
=====

Linear Regression library in pure Javascript

Lyric depends on the great Javascript Matrix library Sylvester by James Coglan available here: 
https://github.com/jcoglan/sylvester

Usage
=====

Include both the lyric.js and the sylvester.js files. You can find Sylvester here: 
    <script type="text/javascript" src="js/sylvester.js"></script>
	<script type="text/javascript" src="js/lyric.js"></script>
	
First, make sure your data is represented in the form of a 2xN array such as the following:

	var input = new Array();
	input[0] = {1, 2, 3, 4, 5}
	input[1] = {0.5, 1.6, 4.5, 7.6, 10.1}

Then you need to have Lyric build the model for you from your data:

	var model = buildModel(input);

Now that you have your model, you will likely want to apply it to a set of inputs. The newInput should be a 1xN array containing only the explanatory variable values you would like to calculate the dependent values. This will result in a new 2xN array which will include the resulting series. 

	var data = applyModel(model, newInput);

The following is a complete example which, given some values for the explanatory values 1 through 5, estimates the values of 6 through 8:

	var data = new Array();
	data[0] = {1, 2, 3, 4, 5}
	data[1] = {0.5, 1.6, 4.5, 7.6, 10.1}
	var estimationRange = {6, 7, 8}

	var estimateData = applyModel(estimationRange, buildModel(data));
	
Implementation
=====
Lyric uses the Normal Equation (closed form) to build the linear model. You can read more about the Normal Equation here:
http://mathworld.wolfram.com/NormalEquation.html

This does introduce the limitation that Lyric will not work on input data that produces a non-invertible matrix when multiplied by its transpose. 

A full breakdown on Lyric is available here: http://tech.flurry.com/lyric-linear-regression-in-pure-javascript