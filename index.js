module.exports = process.env.WALKES_COV
  ? require('./lib-cov')
  : require('./lib');
