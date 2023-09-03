const supertest = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const { Blog } = require('../../models/blogs')
const { listOfBlogsForTest } = require('../../utils/testhelpers/dummyData')
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

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listOfBlogsForTest)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

})