$(document).ready(populateTable());

$("th > span.text-nowrap").click(function() {
    let arrowClasses = $(this).children().attr("class").split(/\s+/);
    $("th > span.text-nowrap > span").removeClass("fa-sort-down");
    $("th > span.text-nowrap > span").removeClass("fa-sort-up");
    $("th > span.text-nowrap > span").addClass("fa-sort");

    if (arrowClasses.includes("fa-sort-down")) {
        $(this).children().removeClass("fa-sort");
        $(this).children().removeClass("fa-sort-down");
        $(this).children().addClass("fa-sort-up");
    }

    else if (arrowClasses.includes("fa-sort-up")) {
        $(this).children().removeClass("fa-sort");
        $(this).children().removeClass("fa-sort-up");
        $(this).children().addClass("fa-sort-down");
    }

    else {
        $(this).children().removeClass("fa-sort");
        $(this).children().addClass("fa-sort-down");
    }
});

function populateTable() {
    $("#scansTableBody").empty();
    $("#scansTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    setTimeout(function() {
        $.get("/api/scans", function(data, status) {

            $(".loadingGif").addClass("hidden")
            if (data.length > 0) {
                $("#scansTable").removeClass("hidden")
                data.forEach(function (scan) {
                    $("#scansTableBody").append('<tr>');
                    $("#scansTableBody").append('<td><span class="text-nowrap">' + scan.name + '</span></td>');
                    $("#scansTableBody").append('<td><span class="text-nowrap">' + scan.scanner_name + '</span></td>');
                    $("#scansTableBody").append('<td><span class="text-nowrap">' + new Date(scan.created).toLocaleString() + '</span></td>');
                    $("#scansTableBody").append('<td><span class="text-nowrap">' + new Date(scan.modified).toLocaleString() + '</span></td>');
                    $("#scansTableBody").append('<td><span class="text-nowrap"><form class="delete-scan" action="/api/scans/' + scan._id + 
                        '" method="POST"><button type="submit" class="btn btn-danger">Delete</button></form></span></td>');
                    $("#scansTableBody").append('</tr>');
                });
            }
        });
    },
    1000);

    $("#filterScans").modal('hide');
    $("#filterScans input").val('');
}