import express from 'express'
import cors from 'cors'
import prisma from './lib/prisma'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// لیست پست‌ها
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { sort_order: 'asc' }
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// گرفتن یک پست با slug
app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug }
    })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// ساخت پست جدید
app.post('/api/blog', async (req, res) => {
  try {
    const post = await prisma.blogPost.create({
      data: req.body
    })
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// آپدیت پست
app.put('/api/blog/:id', async (req, res) => {
  try {
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// حذف پست
app.delete('/api/blog/:id', async (req, res) => {
  try {
    await prisma.blogPost.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})