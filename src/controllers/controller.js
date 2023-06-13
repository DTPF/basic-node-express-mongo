const db = require('../models');

async function helloWorld(req, res) {
  try {
    const getModels = await db.Model.find();
    return res.status(200).send({
      status: 200,
      msg: 'Get success',
      data: getModels,
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      msg: 'Server error',
      error: err,
    });
  } finally {
    console.log('Hello World');
  }
}

module.exports = {
  helloWorld,
};
