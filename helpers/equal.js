module.exports = function(lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error("Handlebars Helper 'equal' needs 2 parameters");
  }

  // Use strict equality to avoid type coercion issues
  if (lvalue === rvalue) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

