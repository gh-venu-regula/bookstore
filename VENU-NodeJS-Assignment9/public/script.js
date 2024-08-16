window.onload=(event)=>{
    reloadPage();
}

document.getElementById('myForm').addEventListener('submit', (event) => {
    event.preventDefault();
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
    if (rating === "" || isNaN(rating) || parseFloat(rating)>5) {
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

    fetch('/books', {
        method: 'POST',
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
        document.getElementById('cardContainer').innerHTML='';
        reloadPage();
        console.log('Book added successfully:', data);
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('genre').value='';
        document.getElementById('pub_year').value='';
        document.getElementById('language').value='';
        document.getElementById('price').value='';
        document.getElementById('publisher').value='';
        document.getElementById('isbn').value='';
        document.getElementById('rating').value='';
        document.getElementById('url').value='';
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
});



function reloadPage(){
    fetch('/books',{
        method:'GET',
        headers:{'Content-Type':'application/json'}
    }).then(resp=>{
        if(!resp.ok){
            return console.log('Network response in not ok');
        }
        return resp.json();
    }).then(data=>{
        createCards(data);
    });
}
function createCards(cardsData){
    cardsData.forEach(cardInfo => {
        let cardContainer=document.getElementById('cardContainer');
        let card=document.createElement('div');
        card.classList.add('card');
        let image=document.createElement('img');
        image.classList.add('cardImage');
        image.src=cardInfo.url;
        image.onerror=function(){
            image.src="sample.jpg";
        }
        let name=document.createElement('p');
        name.classList.add('cardName');
        name.textContent=cardInfo.title;
        let price=document.createElement('p');
        price.classList.add('classPrice');
        price.textContent='$ '+cardInfo.price;
        price.style.color='blue';
        let starContainer=addStars(cardInfo.rating);
        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(starContainer);
        card.appendChild(price);
        let add=document.createElement('button')
            add.classList.add('addButton');
            add.id=`addButton${cardInfo.id}`;
            add.textContent='add to cart';
            add.style.width='100px';
            add.style.height='30px';
            add.style.color='#fff';
            add.style.backgroundColor='green';
            add.style.border='none';
            add.style.textAlign='center';
            add.style.borderRadius='8px';
            add.style.display='none';
            card.appendChild(add);
        cardContainer.appendChild(card);
        card.addEventListener('mouseover', () => {
            let addButton = card.querySelector('.addButton');
            if (addButton) {
                addButton.style.display = 'block';
            }
        });
        
        card.addEventListener('mouseout', () => {
            let addButton = card.querySelector('.addButton');
            if (addButton) {
                addButton.style.display = 'none';
            }
        });
        image.addEventListener('dblclick',()=>{
            window.location.href=`home/book-${cardInfo.id}`;
        });
    });
}
function addStars(rating){
    let container=document.createElement('div');
    container.classList.add('starContainer');
    while(rating>=0.5){
        if(rating>=1){
            let star=document.createElement('div');
            star.classList.add('star');
            star.innerHTML=`<img src="star.png" class="starImage">`;
            container.appendChild(star);
            rating=rating-1;
        }
        else{
            let star=document.createElement('div');
            star.classList.add('halfStar');
            star.innerHTML=`<img src="starhalf.png" class="starImage">`;
            container.appendChild(star);
            rating=rating-0.5;
        }
    }
    return container;
}