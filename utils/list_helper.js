/** HELPER FUNCTIONS */
// group an array of objects into an object
// whose keys are the shared property and
// whose key values are an array of objects
// that shares the same property in the original array
const groupBy = (array, property) => {
    let group = array.reduce((acc, obj) => {
        var key = obj[property] 

        // if property is missing 
        // create a key
        // with a value of an enpty array
        if (!acc[key]) {
            acc[key] = []
        }

        // add the object
        // to the array
        acc[key].push(obj)
        return acc
    }, {})
    return group
}

// find author with largest value
const findAuthorWithMost = (array, value) => {
    array.sort((a, b) => b[value] - a[value])
    return array[0]
}

/** TESTS */
const dummy = blogs => (blogs.length + 1) - blogs.length

const totalLikes = blogs => {
    let reducer = (sum, blog) => sum + blog.likes
    
    return blogs.reduce(reducer, 0)
}    

const favoriteBlog = blogs => {
    blogs.sort((a, b) => a.likes - b.likes)

    let blog = blogs[blogs.length - 1]

    return blogs.length === 0 ? {} : { 
        title: blog.title, 
        author: blog.author, 
        likes: blog.likes
    }
}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return 'no authors'
    } 

    // group blogs by author
    const groupedBlogsByAuthor = groupBy(blogs, 'author')

    // create an array or authors
    const authorNames = Object.keys(groupedBlogsByAuthor)

    let authorData = []

    authorNames.forEach(author => {
        let blogsByAuthor = groupedBlogsByAuthor[author]

        let obj = {
            author,
            blogs: blogsByAuthor.length
        }
        authorData.push(obj)  
    })
    console.log(authorData)
    return findAuthorWithMost(authorData, 'blogs')
}

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return 'no likes'
    } 
    
    // group blogs by author
    const groupedBlogsByAuthor = groupBy(blogs, 'author')

    // create an array or authors
    const authorNames = Object.keys(groupedBlogsByAuthor)

    let authorData = []
    
    authorNames.forEach(author => {
        let blogsByAuthor = groupedBlogsByAuthor[author]

        let obj = {
            author,
            likes: blogsByAuthor.reduce((acc, num) => {
                return acc + num.likes
            }, 0)
        }
        authorData.push(obj)  
    })

    console.log(authorData)
    return findAuthorWithMost(authorData, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}