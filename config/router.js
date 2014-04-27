var router = new geddy.RegExpRouter();

// Models
router.resource('users');
router.resource('posts');
router.resource('comments');
router.resource('categories');
router.resource('pages');
router.resource('menus');
router.resource('links');

// Auth
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');

// Custom routes
router.get('/').to('Posts.index');
router.get('/users/:id/posts').to('Users.posts');
router.get('/users').to('Posts.index');

exports.router = router;
