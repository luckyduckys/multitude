let filter = {};
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

    populateTable();
});

$("#filterHostsForm").submit(async function(event) {
    let keys;
    let formData = $("#filterHostsForm").serializeArray()

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
    populateTable();
});

$(".pagination").on("click", ".page-item", async function(event) {
    let classes = $(this).attr("class").split(/\s+/);
    event.preventDefault();
    
    if (!classes.includes("disabled") && !classes.includes("active")) {

        if (!isNaN(Number($(this).text()))) {
            filter.pageNumber = Number($(this).text());
        }

        else if ($(this).text() === "Previous") {
            filter.pageNumber = Number($(".page-item.active .page-link").text()) - 1;
        }

        else if($(this).text() === "Next") {
            filter.pageNumber = Number($(".page-item.active .page-link").text()) + 1;
        }

        await populateTable();
    }
});

async function populateTable() {
    $("#hostsTableBody").empty();
    $("#hostsTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");
    $(".pagination").addClass("hidden");

    let url = "/api/hosts";
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
        if (url === "/api/hosts") {
            url += "?perPage=25";
        }

        else {
            url += "&perPage=25";
        }
    }

    data = await $.get(url)

    $(".loadingGif").addClass("hidden")
    if (data.hosts.length > 0) {
        $("#hostsTable").removeClass("hidden")
        data.hosts.forEach(function (host) {
            $("#hostsTableBody").append('<tr>');
            $("#hostsTableBody").append('<td><span class="text-nowrap"><input type="checkbox"/></span>')
            $("#hostsTableBody").append('<td><span class="text-nowrap">' + (host.fqdn || '') + '</span></td>');
            $("#hostsTableBody").append('<td><span class="text-nowrap">' + host.ip + '</span></td>');
            $("#hostsTableBody").append('<td><span class="text-nowrap">' + (host.os || '') + '</span></td>');
            $("#hostsTableBody").append('<td><span class="text-nowrap">' + new Date(host.lastScan).toLocaleString() + '</span></td>');
            $("#hostsTableBody").append('</tr>');
        });

        createPagination(data.pageInfo);
    }

    $("#filterHosts").modal('hide');
    //$("#filterHosts input").val('');
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