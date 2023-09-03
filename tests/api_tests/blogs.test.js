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

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listOfBlogsForTest)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

})