const dummy = blogs => (blogs.length + 1) - blogs.length



const totalLikes = blogs => {
    const reducer = (sum, blog) => sum + blog.likes
    
    return blogs.reduce(reducer, 0)
}    


module.exports = {
    dummy,
    totalLikes
}