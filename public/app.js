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
                artTag.attr("href", data[i].url)
                artTag.text(data[i].headline)

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