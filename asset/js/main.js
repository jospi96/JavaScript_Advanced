import axios from "axios";
import _get require( "lodash/get");

const app = document.querySelector(".app");
const form = document.querySelector(".textArea");
const input = document.querySelector(".input");
const paragraferInitia=document.createElement("p");
paragraferInitia.append(`This is an app to get information about books. Search for your favorite gere (in English) 
and you will have the plot of some books at your disposal.`);
app.append(paragraferInitia);

const data = async (mess, path) => {
    try {
        const response = await axios.get(
            `https://openlibrary.org${path}${mess}.json`
        );
        
        if (response.status === 200) {
            let resJson = await response.data;   
            return await resJson;
    }else {
            const paragrafer = document.createElement("p");
            paragrafer.append("The service is currently unavailable, please try later!")
            app.setAttribute("class","noresult");
            app.setAttribute("id", "app-noresult");
            app.append(paragrafer);
            
        }
    }
    catch (e) {
        const paragrafer = document.createElement("p");
        paragrafer.append("The service is currently unavailable, please try later!");
        app.setAttribute("class","noresult");
        app.setAttribute("id", "app-noresult");
        app.append(paragrafer);
        

        

    }
}
form.addEventListener("submit", function (e) {
    e.preventDefault();
    app.removeAttribute("id", "app-noresult");
    app.removeAttribute("class","noresult");
    app.setAttribute("class","app");
    app.replaceChildren("");
    BookListLoad(input.value);
});

async function loadPresentationList(resp) {
    let bookList= _get(resp,"works","erorre");
    
    
    if (bookList.length > 0) {
        const bookInt = document.createElement("div");

        bookInt.setAttribute("id", "book-descrition");
        bookTitle("Book", bookInt, null, null);
        bookAuthor("Author", bookInt);

        for (let k = 0; k < bookList.length; k++) {

            const book = document.createElement("div");
            book.setAttribute("class", "book");
            bookTitle(bookList[k].title, book, bookList[k], resp);

            for (let i = 0; i < bookList[i].authors.length; i++) {
                bookAuthor(bookList[k].authors[i].name, book);
            }
        }
    } else {
        const noresult = document.createElement("p");
        noresult.setAttribute("class","noresult");
        noresult.append("Your search did not return any results, Try again!");
        app.setAttribute("id","app-noresult");
        app.appendChild(noresult);

    }
}
function bookTitle(title, book, sing_resp, risponse) {

    const paragraferBook = document.createElement("p");
    paragraferBook.setAttribute("class", "pbook");
    paragraferBook.append(title);
    book.appendChild(paragraferBook);
    if (sing_resp != null) {
        book.addEventListener("click", function (e) {
            e.preventDefault();
            loadDescription(sing_resp, book, risponse);


        });
    }

}
function bookAuthor(autors, book) {
    const paragraferAuthor = document.createElement("p");
    paragraferAuthor.append(autors);
    paragraferAuthor.setAttribute("class", "pauthor");
    book.appendChild(paragraferAuthor);
    app.appendChild(book);
}



async function BookListLoad(name) {
    let first_response = await data(name, "/subjects/");  
    loadPresentationList(first_response);
}
async function loadDescription(sing_resp, book, first_response) {
    let response = await data(sing_resp.key, "");
    let paragraferDescription = document.createElement("p");
    paragraferDescription.setAttribute("class","description")
    paragraferDescription.append(checkType(response));
    let back = document.createElement("p");
    back.setAttribute("class", "back");
    back.addEventListener("click", function (e) {
        e.preventDefault();
        app.removeChild(book);
        app.removeChild(paragraferDescription);
        app.removeChild(back);
        loadPresentationList(first_response);

    });
    book.setAttribute("id","book-descrition");
    book.setAttribute("class","");
    app.replaceChildren(book, paragraferDescription, back);

}

function checkType(response) {
    try{
    if (typeof response.description === 'string') {
        return response.description;
    }
    else if(response.description==="undefined"){
        return "Sorry description is not available!"
    }else {
        return response.description.value;
    }
}
catch{
    return "Sorry description is not available!"

}
}
