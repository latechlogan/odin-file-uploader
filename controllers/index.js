const homepage = (req, res) => {
  res.send(`Hello, ${req.user ? req.user.username : "World"}!`);
};

export default { homepage };
