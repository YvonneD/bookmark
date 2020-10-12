const modal=document.getElementById('modal')
const modalShow=document.getElementById('show-modal')
const modalClose=document.getElementById('close-modal')
const bookmarkForm=document.getElementById('bookmark-form')
const websiteNameEl=document.getElementById('website-name')
const websiteUrlEl=document.getElementById('website-url')
const bookmarksContainer=document.getElementById('bookmarks-container')
let bookmarks=[]

//show modal
function showModal(){
    modal.classList.add('show-modal')
    websiteNameEl.focus()
}

//validate form
function validate(nameValue,urlValue){
    const expression=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex=new RegExp(expression)
    if(!nameValue||!urlValue){
        alert('please submit the both fields')
        return false
    }
    if(urlValue.match(regex)){
        return true
    }
    if(!urlValue.match(regex)){
        alert('please provide a valid website')
        return false
    }
    return true
}

//build bookmarks dom
function buildBookmarks(){
    //remove all bookmark elements
    bookmarksContainer.textContent=''
    //build items
    bookmarks.forEach((bookmark)=>{
        const {name,url}=bookmark;
        //item
        const item=document.createElement('div')
        item.classList.add('item')
        //close icon
        const closeIcon=document.createElement('i')
        closeIcon.classList.add('fas','fa-trash-alt')
        closeIcon.setAttribute('title','delet bookmark')
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`)
        //link info
        const linkInfo=document.createElement('div')
        linkInfo.classList.add('name')
        const favicon=document.createElement('img')
        favicon.setAttribute('src',`http://www.google.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt','favicon')
        const link=document.createElement('a')
        link.setAttribute('href',`${url}`)
        link.setAttribute('target','_blank')
        link.textContent=name
        //apend to bookmarks container
        linkInfo.append(favicon,link)
        item.append(closeIcon,linkInfo)
        bookmarksContainer.appendChild(item)
    })
}

//event listener
modalShow.addEventListener('click',showModal)
modalClose.addEventListener('click',()=>modal.classList.remove('show-modal'))
window.addEventListener('click',(e)=>(e.target===modal)?modal.classList.remove('show-modal'):false)


//fetch bookmarks
function fetchBookmarks(){
    //get bookmarks from localstorage if availlable
    if(localStorage.getItem('bookmarks')){
        bookmarks=JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        bookmarks=[
            {
                name:'Yvonne Design',
                url:'https://yvonnedi.blogspot.com/'
            }
        ]
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks))
    }
    buildBookmarks()
}

//delete bookmark
function deleteBookmark(url){
    console.log('delete',url)
    bookmarks.forEach((bookmark,index)=>{
        if(bookmark.url===url){
            bookmarks.splice(index,1)
        }
    })
    //update bookmarks array in loacalstorage
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks))
    fetchBookmarks()
}

//handle data from form
function storeBookmark(e){
    e.preventDefault()
    const nameValue=websiteNameEl.value
    let urlValue=websiteUrlEl.value
    if(!urlValue.includes('http://','https://')){
        urlValue=`https://${urlValue}`
    }
    
    if(!validate(nameValue,urlValue)){
        return false
    }
    const bookmark={
        name:nameValue,
        url:urlValue
    }
    bookmarks.push(bookmark)
    
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset()
    websiteNameEl.focus()
}

bookmarkForm.addEventListener('submit',storeBookmark)
//onload fetch
fetchBookmarks()