/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var router = new geddy.RegExpRouter();

// Main
router.get('/').to('Posts.index');

// Models
router.resource('users');
router.resource('posts');
router.resource('comments');
router.resource('categories');

// Auth
router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');
router.post('/auth/local').to('Auth.local');
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');

// Custom routes
router.match('/users/:id/posts', 'GET').to({controller: 'Users', action: 'getPosts'});
router.match('/users/:id/pages', 'GET').to({controller: 'Users', action: 'getPages'});
router.get('/register').to({controller: 'Users', action: 'add'});

router.resource('pages');
router.resource('menus');
exports.router = router;
