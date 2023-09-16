const supertest = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const { Blog } = require('../../models/blogs')
const { listOfBlogsForTest } = require('../../utils/testhelpers/dummyData')
const { User } = require('../../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

describe('Blogs tests', () => {

  test('Blogs has connection to server', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Retrieve all blogs from DB', async () => {
    const blogs = await api.get('/api/blogs').expect(200)
    expect(blogs.body).toHaveLength(6)
  })

  test('Palautettujen blogien identifioivan kentän tulee olla nimeltään id', async () => {
    const blogs = await api.get('/api/blogs').expect(200)
    expect(blogs.body[0].id).toBeDefined()
  })

  test('Blogin lisääminen onnistuu', async () => {
    const toAddBlog = {
      title: 'Blog 7',
      author: 'Author 4',
      url: 'https://example.com/blog/1',
      likes: 0
    }

    const savedBlog = await api
      .post('/api/blogs').send(toAddBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(savedBlog.body.id).toBeDefined()
    const blogs = await api.get('/api/blogs').expect(200)
    expect(blogs.body).toHaveLength(7)
  })

  test('Kentälle likes ei anneta arvoa, oletus arvo on aina 0', async () => {
    const toAddBlog = {
      title: 'Blog 8',
      author: 'Author 4',
      url: 'https://example.com/blog/1',
    }

    const savedBlog = await api
      .post('/api/blogs').send(toAddBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(savedBlog.body.likes).toBeDefined()
    expect(savedBlog.body.likes).toBe(0)
  })

  test('uusi blogi ei sisällä kenttää title tai kenttää url, pyyntöön vastataan statuskoodilla 400 Bad Request', async () => {
    const toAddBlog = {
      author: 'Author 4',
      url: 'https://example.com/blog/1',
    }

    await api
      .post('/api/blogs').send(toAddBlog)
      .expect(400)
  })

  test('Yksittäisen blogin poisto on mahdollinen', async () => {
    const blogs = await api.get('/api/blogs').expect(200)
    const countOfBlogs = blogs.body.length
    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .expect(204)

    const blogs2 = await api.get('/api/blogs').expect(200)
    expect(blogs2.body).toHaveLength(countOfBlogs -1)
  })


  test('Yksittäisen blogin muokkaaminen on mahdollinen', async () => {
    const blogs = await api.get('/api/blogs').expect(200)

    let blogTOModify = blogs.body[0]
    blogTOModify.likes = 300
    await api
      .put(`/api/blogs/${blogs.body[0].id}`).send(blogTOModify)
      .expect(200)

    const modifiedBlog = await api.get(`/api/blogs/${blogs.body[0].id}`).expect(200)
    expect(modifiedBlog.body.likes).toBe(300)
  })

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listOfBlogsForTest)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

})