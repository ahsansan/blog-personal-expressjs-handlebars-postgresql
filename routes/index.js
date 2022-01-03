const express = require('express');
const upload = require('../middlewares/fileUpload.js');
const router = express.Router();
const { home, blogList, addBlog, addBlogForm, deleteBlog, editBlog, updateBlog, blogDetail, contact, registerForm, register, loginForm, login, logout } =require('../controller/blogController.js')

router.get('/', home);
router.get('/contact-form', contact);
router.get('/blog', blogList);
router.get('/add-blog', addBlogForm)
router.post('/blog', upload.single('image'), addBlog);
router.get('/delete-blog/:id', deleteBlog);
router.get('/update-blog/:id', editBlog);
router.post('/update-blog/:id', upload.single('image'), updateBlog);
router.get('/blog-detail/:id', blogDetail);
router.get('/register', registerForm);
router.post('/register', register);
router.get('/login', loginForm);
router.post('/login', login);
router.get('/logout', logout)

module.exports = router