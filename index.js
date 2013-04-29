module.exports = process.env.ESWALKER_COV
  ? require('./lib-cov')
  : require('./lib');
