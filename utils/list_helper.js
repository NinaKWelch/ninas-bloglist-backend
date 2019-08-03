/** FUNCTIONS */
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

// sort objects in an array 
// from highest value to lowest
const sortBy = (array, value) => {
    return array.sort((a, b) => b[value] - a[value])  
}

// add values of same type 
// in an array of objects
const reduceBy = (array, value) => {
    let reducer = (acc, num) => acc + num[value]
    
    return array.reduce(reducer, 0)
}

// return author with highest of a given value
const findAuthorWithHigest = (array, value) => {
    // group blogs by author
    const groupedBlogsByAuthor = groupBy(array, 'author')
 
    // create an array or authors
    const authorNames = Object.keys(groupedBlogsByAuthor)

    const authorData = []

    // create an object for each author
    // and add them to authorData array
    authorNames.forEach(author => {
        let blogsByAuthor = groupedBlogsByAuthor[author]
        let obj = { author }

        if (value === 'blogs') {
            obj[value] = blogsByAuthor.length
        }

        if (value === 'likes') {
            obj[value] = reduceBy(blogsByAuthor, value)
        }

        authorData.push(obj)  
    })

    sortBy(authorData, value)
    return authorData[0]
}

/** HELPER FUNCTIONS */
const dummy = blogs => (blogs.length + 1) - blogs.length

const totalLikes = blogs => {
    return reduceBy(blogs, 'likes')
}    

const favoriteBlog = blogs => {
    sortBy(blogs, 'likes')

    return blogs.length === 0 ? {} : {
        title: blogs[0].title, 
        author: blogs[0].author, 
        likes: blogs[0].likes         
    }
}

const mostBlogs = blogs => {
    return blogs.length !== 0 ? 
        findAuthorWithHigest(blogs, 'blogs') : 
        'no authors'
}

const mostLikes = blogs => {
    return blogs.length !== 0 ? 
        findAuthorWithHigest(blogs, 'likes') : 
        'no likes'
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}