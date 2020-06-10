/**
 * reference - https://github.com/chen0040/js-regression
 * some modification is done for us
 */
var jsregression = jsregression || {};

(function (jsr) {
    'use strict';    
    var LogisticRegression = function(config) {
        var config = config || {};
        if(!config.alpha){
            config.alpha = 0.001;
        }
        if(!config.iterations) {
            config.iterations = 100;
        }
        if(!config.lambda) {
            config.lambda = 0;
        }
        this.alpha = config.alpha;
        this.lambda = config.lambda;
        this.iterations = config.iterations;
    }
    
    LogisticRegression.prototype.fit = function(data) {
        this.dim = data[0].length;
        var N = data.length;
        
        var X = [];
        var Y = [];
        for(var i=0; i < N; ++i){
            var row = data[i];
            var x_i = [];
            var y_i = row[row.length-1];
            x_i.push(1.0);
            for(var j=0; j < row.length-1; ++j){
                x_i.push(row[j]);
            }
            X.push(x_i);
            Y.push(y_i);
        }
        
        this.theta = [];
        for(var d = 0; d < this.dim; ++d){
            this.theta.push(0.0);
        }
        
        for(var iter = 0; iter < this.iterations; ++iter){
            var theta_delta = this.grad(X, Y, this.theta);
            for(var d = 0; d < this.dim; ++d){
                this.theta[d] = this.theta[d] - this.alpha * theta_delta[d];        
            }
        }
        
        this.threshold = this.computeThreshold(X, Y);
        this.threshold_prob = this.prob(X, Y)
        // this.heuristic = []
        // for(var i = 0 ; i < X.length ; i++){
        //     this.heuristic[i] = this.h(X[i], this.theta)
        // }
        
        return {
            co_efficients: this.theta,
            threshold: this.threshold,
            cost_function: this.cost(X, Y, this.theta),
            config: {
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations 
            },
            // predicted_probability: this.heuristic,
            probability: this.threshold_prob
        }
    };
    
    LogisticRegression.prototype.computeThreshold = function(X, Y){
        var threshold=1.0, N = X.length;
        
        for (var i = 0; i < N; ++i) {
            var prob = this.transform(X[i]);
            // console.log(prob)
            if(Y[i] == 1 && threshold > prob){
                threshold = prob;
                // console.log(Y[i], threshold)
            }
        }
        
        return threshold;
    }

    LogisticRegression.prototype.prob = function(X, Y){
        var prob = [];
        var N = X.length;
        
        for (var i = 0; i < N; ++i) {
            prob[i] = this.transform(X[i]);
        }
        
        return prob;
    }
    
    LogisticRegression.prototype.grad = function(X, Y, theta) {
        var N = X.length;
        var Vx = [];
        for(var d = 0; d < this.dim; ++d) {
            var sum = 0.0;
            for(var i = 0; i < N; ++i){
                var x_i = X[i];
                var predicted = this.h(x_i, theta);
                sum += ((predicted - Y[i]) * x_i[d] + this.lambda * theta[d]) / N;
            }    
            Vx.push(sum);
        }
        
        return Vx;
        
    }
    
    LogisticRegression.prototype.h = function(x_i, theta) {
        var gx = 0.0;
        for(var d = 0; d < this.dim; ++d){
            gx += theta[d] * x_i[d];
        }
        return 1.0 / (1.0 + Math.exp(-gx));
    }
    
    LogisticRegression.prototype.transform = function(x) {
        if(x[0].length){ // x is a matrix            
            var predicted_array = [];
            for(var i=0; i < x.length; ++i){
                var predicted = this.transform(x[i]);
                predicted_array.push(predicted);
            }
            // console.log("predicted_array", predicted_array)
            return predicted_array;
        }
        
        var x_i = [];
        // x_i.push(1.0);
        for(var j=0; j < x.length; ++j){
            x_i.push(x[j]);
        }
        // console.log(x_i)
        // console.log(this.theta)
        return this.h(x_i, this.theta);
    }
    
    LogisticRegression.prototype.cost = function(X, Y, theta) {
        var N = X.length;
        var sum = 0;
        for(var i = 0; i < N; ++i){
            var y_i = Y[i];
            var x_i = X[i];
            sum += - (y_i * Math.log(this.h(x_i, theta)) + (1-y_i) * Math.log(1 - this.h(x_i, theta))) / N;
        }
        
        for(var d = 0; d < this.dim; ++d) {
            sum += (this.lambda * theta[d] * theta[d]) / (2.0 * N);
        }
        return sum;
    };
    
    jsr.LogisticRegression = LogisticRegression;

})(jsregression);

var module = module || {};
if(module) {
	module.exports = jsregression;
}