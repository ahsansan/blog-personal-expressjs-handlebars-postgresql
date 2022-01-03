const express = require('express');
const db = require('../connection/db.js');
const bcrypt = require('bcrypt');

let isLogin = false; // islogin

let month = [ 
	'January', 
	'February', 
	'March', 
	'April', 
	'May', 
	'June', 
	'July', 
	'August', 
	'September', 
	'October', 
	'November', 
	'December'
]

function getFullTime(time) {

let date = time.getDate()
let monthIndex = time.getMonth()
let year = time.getFullYear()

let hours = time.getHours()
let minutes = time.getMinutes()

let result = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`

return result
}

function getDistanceTime(time) {

let timePost = time
let timeNow = new Date()

let distance = timeNow - timePost

let milisecond = 1000;
let secondInMinutes = 60;
let minutesInHour = 60;
let hourInDay = 23;

let distanceDay = Math.floor(distance / (milisecond * secondInMinutes * minutesInHour * hourInDay))
let distanceHour = Math.floor(distance / (milisecond * secondInMinutes * minutesInHour))
let distanceMinutes = Math.floor(distance / (milisecond * secondInMinutes))
let distanceSecond = Math.floor(distance / milisecond)

if ( distanceDay >= 1) {
return `${distanceDay} day ago` }

else if ( distanceHour >= 1) {
return `${distanceHour} hours ago` }

else  if ( distanceMinutes >= 1) {
return `${distanceMinutes} minutes ago` }

else {
return `${distanceSecond} second ago` }
}

const home = (req, res) => {
    res.render('index', {isLogin: req.session.isLogin, user: req.session.user})
}

const blogList = (req, res) => {
    db.connect(function(err, client, done){
		if (err) throw err

		client.query(`SELECT blog.id, blog.title, blog.content, blog.image, tb_user.name AS author, blog.post_at
		FROM blog LEFT JOIN tb_user
		ON blog.author_id = tb_user.id`, function(err, result){
			if (err) throw err

			let data = result.rows

			let dataBlogs = data.map((data)=>{
				return {
					...data,
					post_at: getFullTime(data.post_at),
					post_age: getDistanceTime(data.post_at),
					image: '/uploads/'+data.image,
					isLogin: req.session.isLogin
					}
		})

			res.render('blog', {isLogin: req.session.isLogin, blogs: dataBlogs, user: req.session.user});
		})
	})
}

const addBlogForm = (req, res) => {
    res.render('add-blog', {isLogin: req.session.isLogin, user: req.session.user})
}

const addBlog = (req, res) => {
    let data = req.body
	let authorId = req.session.user.id
	let image = req.file.filename

	if(!req.session.isLogin){
		req.flash('danger', 'You must login')
		return res.redirect('/add-blog')
	}

	db.connect(function(err, client, done){
		if (err) throw err

		client.query(`INSERT INTO blog(title, content, image, author_id) VALUES ('${data.title}', '${data.content}', '${image}', ${authorId})`, function(err, result){
			if (err) throw err

			res.redirect('/blog')
		})
	})
}

const deleteBlog = (req, res) => {

    let id = req.params.id;

	db.connect(function(err, client, done){
		if (err) throw err

		client.query(`DELETE FROM blog WHERE id = ${id}`, function(err, result){
			if (err) throw err

			res.redirect('/blog');
    	});
    });
}

const editBlog = (req, res) => {

	let id = req.params.id

	db.connect(function(err, client, done){
		if (err) throw err

		client.query(`SELECT * FROM blog WHERE id = ${id}`, function (err, result) {
			if (err) throw err

			let data = result.rows[0]
			res.render('update-blog', { id: id, blog: data, isLogin: req.session.isLogin, user: req.session.user});

    	});
    });
}

const updateBlog = (req, res) => {

	let data = req.body
	let id = req.params.id
	let image = req.file.filename

	db.connect(function(err, client, done){
		if (err) throw err

		client.query(`UPDATE blog SET title='${data.title}', content='${data.content}', image='${image}' WHERE id = ${id};`, function (err, result) {
			if (err) throw err

			res.redirect('/blog');

    	});
    });
}

const blogDetail = (req, res) => {
	let id = req.params.id

	db.connect(function(err, client, done){
		if (err) throw err

		client.query(`SELECT blog.id, blog.title, blog.content, blog.image, tb_user.name AS author, blog.post_at
		FROM blog LEFT JOIN tb_user
		ON blog.author_id = tb_user.id
		WHERE blog.id = ${id}`, function (err, result) {
			if (err) throw err

			let data = result.rows
			let dataBlog = data.map((data)=>{
				return {
					...data,
					post_at: getFullTime(data.post_at),
					post_age: getDistanceTime(data.post_at),
					image: '/uploads/'+data.image,
					isLogin: req.session.isLogin
					}
		})
			res.render('blog-detail', { id: id, blog: dataBlog, isLogin: req.session.isLogin, user: req.session.user});

    	});
    });
}

const contact = (req, res) => {
	res.render('contact-form', {isLogin: req.session.isLogin, user: req.session.user});
}

const registerForm = (req, res) => {
	res.render('register');
}

const register = (req, res) => {
	const { name, email, password } = req.body
	const hashedPassword = bcrypt.hashSync(password, 10)

	db.connect(function(err, client, done){
		if (err) throw err

		client.query(`INSERT INTO tb_user(name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`, function(err, result){
			if (err) throw err

			res.redirect('/login')
		})
	})
}

const loginForm = (req, res) => {
	res.render('login');
}

const login = (req, res) => {
	const { email, password } = req.body

	db.connect(function(err, client, done){
		if (err) throw err

		client.query(`SELECT * FROM tb_user WHERE email = '${email}'`, function(err, result){
			if (err) throw err

			if (result.rows.length == 0){
				req.flash('danger', 'Email and Password dont Match')
				return res.redirect('/login')
			}

			let isMatch = bcrypt.compareSync(password, result.rows[0].password)

			if (isMatch) {
				req.session.isLogin = true
				req.session.user = {
					id: result.rows[0].id,
					name: result.rows[0].name,
					email: result.rows[0].email
				}
				req.flash('success', 'Login Success')
				res.redirect('/blog')
			} else {
				req.flash('danger', 'Email and Password dont Match')
				res.redirect('/login')
			}
		})
	})
}

const logout = (req, res) => {
	req.session.destroy()
	res.redirect('/blog')
}

module.exports = {
	home, blogList, addBlog, addBlogForm, deleteBlog, editBlog, updateBlog, blogDetail, contact, registerForm, register, loginForm, login, logout
}