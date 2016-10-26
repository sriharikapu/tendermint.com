let _ = require('lodash')
let fs = require('fs')
let glob = require('glob')
let moment = require('moment')
let md = require('markdown-it')()
let toSlugCase = require('to-slug-case')
let toPascalCase = require('to-pascal-case')
let yaml = require('js-yaml')

let blogTitle = 'Tendermint Blog'

let postsDirectory = './blog/posts/'
let postsVueDirectory = './src/components/blog/'
let posts = glob.sync(postsDirectory + '*.md')

let staticRouterFile = './src/router/staticRouter.js'
let routerFile = './src/router/index.js'
let blogIndexFile = './src/components/pages/BlogIndex.vue'
let blogRssFile = './src/assets/feed.xml'

let vueTemplatePost = require('./vueTemplatePost.js')
let rssTemplate = require('./rssTemplate.js')

function markdownToObject (files) {
  let posts = []
  for (let i = 0; i < files.length; i++) {
    let post = {title: '', slug: '', author: '', date: '', body: ''}

    let data = fs.readFileSync(files[i], 'utf8')
    let metaData = yaml.load(data.split('---')[1])
    let markdownData = data.split('---')[2]

    // set the post metadata
    post.title = metaData.title
    post.slug = toSlugCase(metaData.title)
    post.author = metaData.author
    post.date = moment(metaData.date).valueOf() // ms since epoch
    post.description = metaData.description
    post.filename = post.slug + '.vue'
    post.filepath = postsVueDirectory + post.filename
    post.dateFriendly = moment(post.date, 'x').format('LL')
    post.body = md.render(markdownData)

    post.file = vueTemplatePost(post)

    posts.push(post)
  }
  // order posts by newest first
  posts = _.orderBy(posts, ['date'], ['desc'])
  return posts
}

function writePostsFiles (data) {
  for (let i = 0; i < data.length; i++) {
    let file = data[i].filepath
    let content = data[i].file
    fs.writeFileSync(file, content, 'utf8')
    console.log(`  ✓ ${file}`)
  }
}

function writePostsIndexFile (data) {
  let f = '<!--THIS FILE IS GENERATED BY `./blog/build.js` DO NOT EDIT HERE-->\n'
  f += '<template><div id="page-blog-index">\n'
  f += '  <section id="section-top"><div class="section-container">\n'
  f += '  <div class="article-wrapper" id="blog-index">\n'
  f += `    <h1><i class="fa fa-rss"></i> ${blogTitle}</h1>\n`
  f += '    <p>Learn about what we&rsquo;re working on, right this moment. <a href="/static/feed.xml">Subscribe via RSS</a></p>\n'
  f += '  </div></section>\n'
  f += '<section class="section-default section-flush"><div class="section-container"><div class="section-content">\n'
  for (let i = 0; i < data.length; i++) {
    f += `<div class="li-article">\n`
    f += `  <router-link class="li-article-link" :to="'/blog/${data[i].slug}'">\n`
    f += `    <header class="li-article-header"><h2>${data[i].title}</h2></header>\n`
    f += `    <div class="li-article-content">${data[i].description}</div>\n`
    f += `  </router-link>\n`
    f += `  <div class="li-article-meta">\n`
    f += `    <div class="date">Posted on ${data[i].dateFriendly}</div>\n`
    f += `  </div>\n`
    f += `</div>\n`
  } 
  f += '  </div></div></section>\n'
  f += '</div></template>\n'
  f += '<script>\n'
  f += 'export default {\n'
  f += '  head: {\n'
  f += '    title: {\n'
  f += '      inner: \'Blog\'\n'
  f += '    }\n'
  f += '  }\n'
  f += '}\n'
  f += '</script>\n'

  fs.writeFileSync(blogIndexFile, f, 'utf8')
  console.log(`  ✓ ${blogIndexFile}`)
}



function writeRoutesFile (data) {
  let staticRouter = fs.readFileSync(staticRouterFile, 'utf8')

  let file = '// THESE BLOG ROUTES ARE GENERATED BY `./blog/build.js` DO NOT EDIT HERE-->\n'
  for (let i = 0; i < data.length; i++) {
    let importStr = `import Blog${toPascalCase(data[i].title)}`
    let fromStr = ` from '../components/blog/${(data[i].filename)}'\n`
    file += importStr + fromStr
  }
  file += 'const blogRoutes = [\n'
  for (let i = 0; i < data.length; i++) {
    let routePath = `/blog/${data[i].slug}`
    let routeComponent =  `Blog${toPascalCase(data[i].title)}`

    let route = `  { path: '${routePath}', component: ${routeComponent} }`

    if (i < data.length - 1) { route += ',' } // add comma for route item
    route += '\n' // add newline

    file += route
  }
  file += ']\n\n'

  file += staticRouter

  fs.writeFileSync(routerFile, file, 'utf8')
  console.log(`  ✓ ${routerFile}\n`)
  console.log(`  ${blogTitle} built successfully.\n`)
}

function writeRssFile (data) {
  let rss = rssTemplate(data)
  fs.writeFileSync(blogRssFile, rss, 'utf8')

  console.log(`  ✓ ${blogRssFile}`)
}

let postData = markdownToObject(posts)
writePostsFiles(postData)
writePostsIndexFile(postData)
writeRssFile(postData)
writeRoutesFile(postData)