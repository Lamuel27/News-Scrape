$(document).ready(function () {



    function displayArticles() {
        $.getJSON("/articles", function (data) {
            for (var i = 0; i < data.length; i++) {

                var panelDiv = $("<div>")
                panelDiv.attr("id", data[i]._id)
                panelDiv.addClass("card-panel")

                var panelHeading = $("<div></div>")
                var panelTitle = $("<h3></h3>")


                var artTag = $("<a class='article-title'>");
                artTag.attr("target", "_blank")
                artTag.attr("href", "https://www.screenrant.com" + data[i].url)
                artTag.text(data[i].title)

                panelTitle.append(artTag)
                panelHeading.append(panelTitle)
                panelDiv.append(panelHeading)

                panelDiv.append(data[i].summary)
                if (data[i].isSaved) {

                    panelTitle.append("<a data-id='" + data[i]._id + "' class='waves-effect waves-light btn' id='delete-button'>" + "Delete Article" + "</a>");
                    panelTitle.append("<a data-id='" + data[i]._id + "' class='waves-effect waves-light btn' id='note-button'>" + "Article Notes" + "</a>");
                    $("#saved-articles").append(panelDiv)
                }
                else {

                    panelTitle.append("<a data-id='" + data[i]._id + "' class='waves-effect waves-light btn' id='save-button'>" + "Save Article" + "</a>");
                    $("#articles").append(panelDiv)

                }
            }
        });
    }
    displayArticles();
    
    $(document).on("click", "#scrape-button", function () {
        $.ajax({
            method: "GET",
            url: "/scrape"

        }).then(function (data) {
            console.log(data);

            displayArticles();

            $("#scrapeModalLabel").text("Action! You found some new articles!")
            $("#scrapeModalBody").text("Awesome!")
            $(".modal").modal()

                $("#modal1").modal("open");

        });
    });

    $(document).on("click", "#savenote", function () {
        var thisId = $(this).attr("data-id");

        console.log(thisId)
        console.log($("#titleinput").val())

        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                label: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
            .then(function (data) {
                console.log(data);

            });

        $("#titleinput").val("");
        $("#bodyinput").val("");
    });

    $(document).on("click", "#note-button", function () {

        var thisId = $(this).attr("data-id");
        console.log(thisId)

        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            .then(function (data) {
                console.log(data);

                $("#noteModalLabel").empty()
                $("#noteModalBody").empty()
                $("#noteModalLabel").append("<br> <textarea id='titleinput' class='materialize-textarea' rows='2' placeholder='Note Title'></textarea>")
                $("#noteModalBody").append("<textarea id='bodyinput' class='materialize-textarea' placeholder='Note Body'></textarea>")

                $("#savenote").attr("data-id", data._id)

                if (data.note) {
                    $("#titleinput").val(data.note.label);
                    $("#bodyinput").val(data.note.body);
                }

                $(".modal").modal();
                $("#noteModal").modal("open");

            });
    });

    $(document).on("click", "#savenote", function () {
        var thisId = $(this).attr("data-id");

        console.log(thisId)
        console.log($("#titleinput").val())

        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
            .then(function (data) {
                console.log(data);

            });

        $("#titleinput").val("");
        $("#bodyinput").val("");
    });

    $(document).on("click", "#save-button", function () {
        console.log(this)

        var id = ($(this).attr("data-id"));
        $.ajax({
            method: "PUT",
            url: "/articles/" + id

        })
            .then(function (data) {
                console.log(data);

                $("#" + id).remove();

            });
    });

    url = 
    // $('a href').each(function() {
    //     $(this).attr('href', 'http://www.screenrant.com')
    // })

    $(document).on("click", "#delete-button", function () {
        console.log(this)
        var id = ($(this).attr("data-id"));
        $.ajax({
            method: "DELETE",
            url: "/articles/" + id
        }).then(function (data) {
            console.log("hello")
            console.log(data);

            $("#" + id).remove();
        });
    });
})