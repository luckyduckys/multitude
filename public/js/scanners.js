$(document).ready(populateTable());

$('#createNewScannerForm').submit(function (event) {
    event.preventDefault();
    $.ajax({
        url: '/api/scanners',
        type: 'post',
        data: JSON.stringify({
            name: $('#createNewScannerForm').serializeArray()[0].value,
            ipAddress: $('#createNewScannerForm').serializeArray()[1].value,
            username: $('#createNewScannerForm').serializeArray()[2].value,
            password: $('#createNewScannerForm').serializeArray()[3].value
        }),
        contentType: "application/json",
        success: populateTable()
    });
});

$('#scannerTableBody').on('submit', '.delete-scanner', function(event) {
    event.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        type: 'delete',
        success: populateTable()
    })
});

$("th > span.text-nowrap").click(function() {
    let arrowClasses = $(this).children().attr("class").split(/\s+/);
    let filter = {}

    $("th > span.text-nowrap > span").removeClass("fa-sort-down");
    $("th > span.text-nowrap > span").removeClass("fa-sort-up");
    $("th > span.text-nowrap > span").addClass("fa-sort");

    if (arrowClasses.includes("fa-sort-down")) {
        $(this).children().removeClass("fa-sort");
        $(this).children().removeClass("fa-sort-down");
        $(this).children().addClass("fa-sort-up");
        filter.orderby = $(this).text()
        filter.order = "ascending";
    }

    else if (arrowClasses.includes("fa-sort-up")) {
        $(this).children().removeClass("fa-sort");
        $(this).children().removeClass("fa-sort-up");
        $(this).children().addClass("fa-sort-down");
        filter.orderby = $(this).text()
        filter.order = "descending";
    }

    else {
        $(this).children().removeClass("fa-sort");
        $(this).children().addClass("fa-sort-down");
        filter.orderby = $(this).text();
        filter.order = "descending";
    }

    populateTable(filter);
});

function populateTable(filter = null) {
    $("#scannerTableBody").empty();
    $("#scannerTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    setTimeout(function() {

        let url = "/api/scanners";

        if (filter != null) {
            url += "?order=" + filter.order + "&orderby=" + filter.orderby;
        }

        $.get(url, function(data, status) {

            $(".loadingGif").addClass("hidden");

            if (data.length > 0) {

                $("#scannerTable").removeClass("hidden");
                
                data.forEach(function (scanner) {
                    $("#scannerTableBody").append('<tr>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.name + '</span></td>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.ip + '</span></td>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + (scanner.status || '') + '</span></td>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + (scanner.version || '') + '</span></td>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + (scanner.type || '') + '</span></td>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap"><form class="delete-scanner" action="/api/scanners/' + scanner._id + 
                        '" method="POST"><button type="submit" class="btn btn-danger">Delete</button></form></span></td>');
                    $("#scannerTableBody").append('</tr>');
                });
            }
        });
    },
    1000);

    $("#addNewScanner").modal('hide');
    $("#addNewScanner input").val('');
}