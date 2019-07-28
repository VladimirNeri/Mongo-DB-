// Grab the articles as a json
function renderArticles() {
  $.getJSON("/articles", function (data) {
    console.log(data)
    // limits number of articles to 20
    for (var i = (data.length-1); i > (data.length-20); i--) {
    // Display the apropos information on the page
      var newCard = `<div class="card">
      <a href="${data[i].link}"><h5 class="card-header">${data[i].title}</h5></a>
      <div class="card-body">
      <p class="card-text">${data[i].summary}</p>
      <a  href="#"  data-id="${ data[i]._id}" class="btn btn-primary saveArticle">Save Article</a>
      </div>
      </div>`
      $("#articles").append(newCard);
    }
  });
}

renderArticles();

$(document).on("click", ".saveArticle", function () {
// Grab the id associated with the article from the submit button
 var id = $(this).data("id")
  $.post( "savethisarticle/"+ id, function( data ) {
    $("#articles").empty();
    renderArticles()
  });
})

$(document).on("click", "#scrapeNow", function () {
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    .then(function (data) {
      $("#articles").empty();
      renderArticles();
    })
})


