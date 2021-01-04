let filter = {}
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

$("#filterScannersForm").submit(async function(event) {
    let keys;
    let formData = $("#filterScannersForm").serializeArray()

    event.preventDefault();
    
    formData.forEach(function(item) {
        filter[item.name] = item.value;
    });

    keys = Object.keys(filter);
    keys.forEach(function(key) {

        if (filter[key] === "") {
            delete filter[key];
        }
    });

    filter.pageNumber = 1;
    await populateTable();
});

async function populateTable() {
    $("#scannerTableBody").empty();
    $("#scannerTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    let url = "/api/scanners";

    let keys = Object.keys(filter);
    let data;

    for (let i = 0; i < keys.length; i++) {
        if (i === 0) {
            url += "?" + keys[i] + "=" + filter[keys[i]];
        }

        else {
            url += "&" + keys[i] + "=" + filter[keys[i]];
        }
    }

    if (typeof filter.perPage === 'undefined') {
        if (url === "/api/scanners") {
            url += "?perPage=25";
        }

        else {
            url += "&perPage=25";
        }
    }

    data = await $.get(url, function(data, status) {

        $(".loadingGif").addClass("hidden");

        if (data.scanners.length > 0) {

            $("#scannerTable").removeClass("hidden");
            
            data.scanners.forEach(function (scanner) {
                $("#scannerTableBody").append('<tr>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.name + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.ip + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + (scanner.status || 'pending') + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + (scanner.version || '') + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + (scanner.type || '') + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap"><form class="delete-scanner" action="/api/scanners/' + scanner._id + 
                    '" method="POST"><button type="submit" class="btn btn-danger">Delete</button></form></span></td>');
                $("#scannerTableBody").append('</tr>');
            });
            
            createPagination(data.pageInfo);
        }
    });

    $("#addNewScanner").modal('hide');
    $("#addNewScanner input").val('');
    $("#filterScanners").modal('hide');
}

function createPagination(pageInfo) {
    let pagesBefore = ((pageInfo.pageNumber - 1 ) % 5);
    let pagesAfter = 5 - pagesBefore - 1;

    $(".pagination").removeClass("hidden");
    $(".pagination").empty();

    if (pageInfo.pageNumber === 1) {
        $(".pagination").append('<li class="page-item disabled"><a class="page-link" tabindex="-1">Previous</a></li>');
    }

    else {
        $(".pagination").append('<li class="page-item"><a class="page-link" tabindex="-1">Previous</a></li>');
    }

    for (let i = pagesBefore; i > 0; i--) {
        $(".pagination").append('<li class="page-item"><a class="page-link" >' + (pageInfo.pageNumber - i));
    }

    $(".pagination").append('<li class="page-item active"><a class="page-link" >' + pageInfo.pageNumber)
    
    for (let i = 1; i <= pagesAfter; i++) {
        if (pageInfo.pageNumber + i <= pageInfo.totalPages) {
            $(".pagination").append('<li class="page-item"><a class="page-link" >' + (pageInfo.pageNumber + i));
        }

        else {
            break;
        }
    }

    if (pageInfo.pageNumber === pageInfo.totalPages) {
        $(".pagination").append('<li class="page-item disabled"><a class="page-link" >Next</a></li>');
    }

    else {
        $(".pagination").append('<li class="page-item"><a class="page-link" >Next</a></li>');
    }
}