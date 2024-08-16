window.onload = function () {
    fetchDetails();
}
window.onclick=function(event){
    const modal=document.getElementById('modal');
    if(event.target==modal){
        modal.style.display='none';
    }
}
document.getElementById('updateForm').addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('modal').style.display = "none";
    let id = document.getElementById('id').value.trim();
    let title = document.getElementById('title').value.trim();
    let author = document.getElementById('author').value.trim();
    let genre = document.getElementById('genre').value.trim();
    let publication_year = document.getElementById('pub_year').value.trim();
    let language = document.getElementById('language').value.trim();
    let price = document.getElementById('price').value.trim();
    let publisher = document.getElementById('publisher').value.trim();
    let isbn = document.getElementById('isbn').value.trim();
    let rating = document.getElementById('rating').value.trim();
    let url = document.getElementById('url').value.trim();
    if (title === "") {
        alert('Enter a valid title');
        return;
    }
    if (author === "") {
        alert('Enter a valid author');
        return;
    }
    if (genre === "") {
        alert('Enter a valid genre');
        return;
    }
    if (publication_year === "" || isNaN(publication_year)) {
        alert('Enter a valid publication year');
        return;
    }
    if (language === "") {
        alert('Enter a valid language');
        return;
    }
    if (price === "" || isNaN(price)) {
        alert('Enter a valid price');
        return;
    }
    if (publisher === "") {
        alert('Enter a valid publisher');
        return;
    }
    if (isbn === "" || isNaN(isbn)) {
        alert('Enter a valid ISBN');
        return;
    }
    if (rating === "" || isNaN(rating) || parseFloat(rating) > 5) {
        alert('Enter a valid rating');
        return;
    }
    if (url === "") {
        alert('Enter a valid URL');
        return;
    }
    let dataValues = {
        title: title,
        author: author,
        genre: genre,
        publication_year: publication_year,
        language: language,
        price: price,
        publisher: publisher,
        isbn: isbn,
        rating: rating,
        url: url
    };
    console.log("New book data:", dataValues);

    fetch(`/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataValues)
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json();
        })
        .then(data => {
            if (data.status !== true) {
                console.error('Error:', data.status);
                return;
            }
            fetchDetails();
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

});
document.getElementById('editButton').addEventListener('click', () => {
    let modal = document.getElementById('modal');
    modal.style.display = "block";
    let lastPart = window.location.pathname.split('/').pop();
    let Id = lastPart.split('-').pop();
    fetch(`/books/${Id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(resp => {
        if (!resp.ok) {
            alert('Network response is not ok');
            throw new Error('Network response is not ok');
        }
        return resp.json();
    }).then(dataValues => {
        let data=dataValues[0];
        console.log(data);
        document.getElementById('id').value=data.id;
        document.getElementById('title').value=data.title;
        document.getElementById('author').value=data.author;
        document.getElementById('genre').value=data.genre;
        document.getElementById('pub_year').value=data.publication_year;
        document.getElementById('language').value=data.language;
        document.getElementById('price').value=data.price;
        document.getElementById('publisher').value=data.publisher;
        document.getElementById('isbn').value=data.isbn;
        document.getElementById('rating').value=data.rating;
        document.getElementById('url').value=data.url;
    });
});

document.getElementById('deleteButton').addEventListener('click',()=>{
    let lastPart=window.location.pathname.split('/').pop();
    let Id=lastPart.split('-').pop();
    fetch(`/books/${Id}`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'}
    }).then(resp=>{
        if(!resp.ok){
            alert("Network response is not ok");
            throw new Error('Network response is not ok');
        }
        return resp.json();
    }).then(data=>{
        if(data.status!==true){
            alert(data.status);
            throw new Error(data.status);
        }
        window.location.href='/home';
    }).catch(error=>{
        throw new Error('fetch error : '+error);
    });
});

document.getElementById('close').addEventListener('click', () => {
    let modal = document.getElementById('modal');
    modal.style.display = "none";
});
function fetchDetails() {
    const lastPart = window.location.pathname.split('/').pop();
    const Id = lastPart.split('-').pop();
    fetch(`/books/${Id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(resp => {
        if (!resp.ok) {
            let container = document.getElementById('mainContainer');
            container.innerHTML = '';
            container.innerHTML = `
            <p style="font-weight:bold;font-size:80px;">404 Not found</p>
            `;
            container.style.padding = "40dp";
            container.style.border = "2px solid black";
            container.style.display = "flex";
            container.style.justifyContent = "center";
            container.style.padding = "5px";
            throw new Error('Network response is not ok');
        }
        return resp.json();
    }).then(data => {
        setDetails(data[0]);
    });
}
function setDetails(details) {
    let bookImage = document.getElementById('bookImage');
    bookImage.src = details.url;
    bookImage.onerror = function () {
        bookImage.src = '/sample.jpg';
    }
    let bookName = document.getElementById('bookName');
    bookName.textContent = details.title;
    let div=document.getElementById('ratingTextContainer');
    if(div){
        div.remove();
        document.getElementById('starContainer').remove();
    }
    let ratingTextContainer = document.createElement('div');
    ratingTextContainer.id='ratingTextContainer';
    ratingTextContainer.style.paddingLeft = '3px';
    let ratingText = document.createElement('p');
    ratingText.textContent = `( ${details.rating} / 5)`;
    ratingTextContainer.appendChild(ratingText);

    let ratingContainer = setRating(details.rating);

    let ratingBar = document.createElement('div');
    ratingBar.style.display = 'flex';
    ratingBar.style.flexDirection = 'row';
    ratingBar.style.alignItems = 'center';
    ratingBar.appendChild(ratingContainer);
    ratingBar.appendChild(ratingTextContainer);

    document.getElementById('nameContainer').appendChild(ratingBar);
    let price = document.getElementById('bookPrice');
    price.textContent = "$ " + details.price;
    let list1 = document.getElementById('list1');
    let list2 = document.getElementById('list2');
    list1.innerHTML = `
    <li><span style="font-weight:bold">Author</span> : ${details.author}</li>
    <li><span style="font-weight:bold">isbn</span>    : ${details.isbn}</li>
    <li><span style="font-weight:bold">genre</span>   : ${details.genre}</li>
    `;
    list2.innerHTML = `
    <li><span style="font-weight:bold">Publication Year</span>  : ${details.publication_year}</li>
    <li><span style="font-weight:bold">Language</span>          : ${details.language}</li>
    <li><span style="font-weight:bold">publisher</span>         :${details.publisher}</li>
    `;
}
function setRating(rating) {
    let container = document.createElement('div');
    container.classList.add('starContainer');
    container.id='starContainer';
    while (rating >= 0.5) {
        if (rating >= 1) {
            let star = document.createElement('div');
            star.classList.add('star');
            star.innerHTML = `<img src="/star.png" class="starImage">`;
            container.appendChild(star);
            rating = rating - 1;
        }
        else {
            let star = document.createElement('div');
            star.classList.add('halfStar');
            star.innerHTML = `<img src="/starhalf.png" class="starImage">`;
            container.appendChild(star);
            rating = rating - 0.5;
        }
    }
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    return container;
}