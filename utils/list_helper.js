const dummy = blogs => (blogs.length + 1) - blogs.length

const totalLikes = blogs => {
    const reducer = (sum, blog) => sum + blog.likes
    
    return blogs.reduce(reducer, 0)
}    

const favoriteBlog = blogs => {
    blogs.sort((a, b) => a.likes - b.likes)

    const blog = blogs[blogs.length - 1]

    return blogs.length === 0 ? {} : { 
        title: blog.title, 
        author: blog.author, 
        likes: blog.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}