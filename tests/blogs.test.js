const { dummy, totalLikes, favoriteBlog, mostBlogs, authorWithMostLikes } = require('../utils/testhelpers/list_helper')

test('dummy returns one', () => {
  const result = dummy(listWithOneBlog)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('Method return the blog has most likes', () => {

    const result = favoriteBlog(blogs)
    expect(result).toEqual( {
      title: 'Blog 6',
      author: 'Author 2',
      url: 'https://example.com/blog/1',
      likes: 1110
    })
  })

  test('Method return Writer has most blogs', () => {
    authorWithMostLikes(blogs)
    expect(mostBlogs(blogs)).toEqual({ author: 'Author 2', blogs: 3 })

  })

  test('Method return Writer has most likes', () => {
    authorWithMostLikes(blogs)
    expect(authorWithMostLikes(blogs)).toEqual({ author: 'Author 2', likes: 1240 })

  })
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'https://example.com/blog/1',
    likes: 10
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'https://example.com/blog/2',
    likes: 15
  },
  {
    title: 'Blog 3',
    author: 'Author 3',
    url: 'https://example.com/blog/3',
    likes: 23
  },
  {
    title: 'Blog 4',
    author: 'Author 1',
    url: 'https://example.com/blog/1',
    likes: 40
  },
  {
    title: 'Blog 5',
    author: 'Author 2',
    url: 'https://example.com/blog/2',
    likes: 115
  },
  {
    title: 'Blog 6',
    author: 'Author 2',
    url: 'https://example.com/blog/1',
    likes: 1110
  },
]