module.exports = {
  v2: (app, basePath) => {
    // Plugin & Themes
    [ 'plugins', 'themes' ].forEach(entity => {
      // Search/dep tree
      app.get(`${basePath}/${entity}/search`, (_, res) => res.sendStatus(501));
      app.get(`${basePath}/${entity}/:id/dependency_tree`, (_, res) => res.sendStatus(501));

      // Reviews
      app.get(`${basePath}/${entity}/:id/reviews`, (_, res) => res.sendStatus(501));
      app.post(`${basePath}/${entity}/:id/reviews`, (_, res) => res.sendStatus(501));
      app.delete(`${basePath}/${entity}/:id/reviews/:r_id`, (_, res) => res.sendStatus(501));
    });
  }
};