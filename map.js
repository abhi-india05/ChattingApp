const UniqueIDDirectory = new Map();

function setUser(id, user) {
  UniqueIDDirectory.set(id, user);
}

function getUser(id) {
  return UniqueIDDirectory.get(id);
}

module.exports = {
  setUser,
  getUser,
};