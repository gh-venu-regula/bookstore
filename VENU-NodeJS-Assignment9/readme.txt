The responsive Book-Store project , mainly consists 4 functionalities

NOTE : I added a new extra column for database called 'url' for displaying book cover page for better looking of webpage.

👉👉👉👉👉 Home page : http://localhost:3000/home 👈👈👈👈👈👈

1. DISPLAYING ALL BOOKS in database in cards format( using GET method, Whenever the page is loaded, it displays automatically).

2. ADDING NEW BOOK to the database by filling a form in home screen(using POST method).

3. DISPLAYING A SPECIFIC BOOK DETAILS like author, price, isbn etc.,(using GET method)
   
   option-1 : Double click any card in home screen.
   option-2 : Navigate to the 👉👉 http://localhost:3000/home/book-id 👈👈 where id replaced by 1 ,2, etc.,
   (navigating to an unavailable book-id will displays 404 NOT FOUND).

4.EDIT A SPECIFIC BOOK (using PUT method)

   step-1 : Navigate to specific book by double click on it.
   step-2 : click on edit button( blue pen symbol on top right corner) and a pop up modal will be displayed with a from.
   step-3 : fill out the form with updated details and submit the form.

4.DELETE A SPECIFIC BOOK (using DELETE method)

   step-1 : Navigate to specific book by double click on it.
   step-2 : click on delete button( red bin symbol on top right corner).

UPCOMING FEATURE:
additionally, Iam implementing ADD TO CART option where we can add few books to the cart for ordering purpose, which is still in progress.
   
