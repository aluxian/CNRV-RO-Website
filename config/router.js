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
router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');
router.post('/auth/local').to('Auth.local');
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');

// Custom routes
router.get('/').to('Posts.index');
router.get('/users/:id/posts').to({controller: 'Users', action: 'getPosts'});
router.get('/register').to({controller: 'Users', action: 'add'});

exports.router = router;
