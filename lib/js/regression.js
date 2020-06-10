/**
 * the math.js library  - https://mathjs.org/docs/expressions/parsing.html
 * this regression is taken from - https://www.robinwieruch.de/logistic-regression-gradient-descent-classification-javascript
 * and then updated according to our dataset and need
 */
"use strict"

let logisticRegressionTest = function(){

    function init(matrix) {

        // Part 0: Preparation
        // console.log('Part 0: Preparation ...\n');
      
        let X = math.evaluate('matrix[:, 1:21]', {
          matrix,
        });
        // console.log(X[0])
        let y = math.evaluate('matrix[:, 22]', {
          matrix,
        });
        // console.log(y[0])
      
        let m = y.length;
        let n = X[0].length;
      
        // Part 1: Cost Function and Gradient
        // console.log('Part 1: Cost Function and Gradient ...\n');
      
        // Add Intercept Term
        X = math.concat(math.ones([m, 1]).valueOf(), X);
      
        let theta = Array(n + 1).fill().map(() => [0]);
        // console.log("initial theta", theta)
        let untrained_result = costFunction(theta, X, y);
      
        // console.log('cost: ', untrained_result.cost_function);
        // console.log('\n');
        // console.log('grad: ', untrained_result.gradient);
        // console.log('\n');
        // console.log("h_sig: ", untrained_result.hypothesis)
      
        // Part 2: Gradient Descent (without feature scaling)
        // console.log('Part 2: Gradient Descent ...\n');
      
        const ALPHA = 0.001;
        const ITERATIONS = 1000;
      
        // theta = [[-25], [0], [0]];
        // console.log("theta", theta)
        theta = gradientDescent(X, y, theta, ALPHA, ITERATIONS);
      
        let trained_result = costFunction(theta, X, y)
      
        // console.log('theta: ', theta);
        // console.log('\n');
        // console.log('cost: ', trained_result.cost_function);
        // console.log('\n');
        // console.log("h_sig: ", trained_result.hypothesis)
      
        // // Part 3: Predict admission of a student with exam scores 45 and 85
        // console.log('Part 3: Admission Prediction ...\n');
      
        // // let studentVector = [1, 45, 85];
        // let prob = sigmoid(math.evaluate('X * theta', {
        //   X,
        //   theta,
        // }));
      
        // console.log('Predicted admission for student with scores 45 and 85 in exams: ', prob);
        // console.log(theta)
        // console.log(trained_result)
        return trained_result;
      }
      
      function sigmoid(z) {
        let g = math.evaluate(`1 ./ (1 + e.^-z)`, {
          z,
        });
      
        return g;
      }
      
      function costFunction(theta, X, y) {
      
        const m = y.length;
      
        let h = sigmoid(math.evaluate(`X * theta`, {
          X,
          theta,
        }));
      
        const cost = math.evaluate(`(1 / m) * (-y' * log(h) - (1 - y)' * log(1 - h))`, {
          h,
          y,
          m,
        });
      
        const grad = math.evaluate(`(1 / m) * (h - y)' * X`, {
          h,
          y,
          m,
          X,
        });
      
        let result = {
            probability : h,
            cost_function: cost,
            // gradient: grad,
            co_efficients: theta
        }
        return result;
      }
      
      function gradientDescent(X, y, theta, ALPHA, ITERATIONS) {
        const m = y.length;
      
        for (let i = 0; i < ITERATIONS; i++) {
          let h = sigmoid(math.evaluate(`X * theta`, {
            X,
            theta,
          }));
      
          theta = math.evaluate(`theta - ALPHA / m * ((h - y)' * X)'`, {
            theta,
            ALPHA,
            m,
            X,
            y,
            h,
          });
        }
      
        return theta;
      }
      
      function predict(theta, X) {
        let p = sigmoid(math.evaluate(`X * theta`, {
          X,
          theta,
        }));
      
        return p;
      }

    return{
        init
    };

}