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

$("#createUserForm").submit(function(event) {
    event.preventDefault();
    $.ajax({
        url: '/api/users',
        type: 'post',
        data: JSON.stringify({
            firstName: $('#createUserForm').serializeArray()[0].value,
            lastName: $('#createUserForm').serializeArray()[1].value,
            email: $('#createUserForm').serializeArray()[2].value,
            username: $('#createUserForm').serializeArray()[3].value,
            password: $('#createUserForm').serializeArray()[4].value
        }),
        contentType: "application/json",
        success: populateTable()
    });
})

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
    $("#usersTableBody").empty();
    $("#usersTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");
    $(".pagination").addClass("hidden");

    let url = "/api/users";

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
        if (url === "/api/users") {
            url += "?perPage=25";
        }

        else {
            url += "&perPage=25";
        }
    }

    data = await $.get(url)

    $(".loadingGif").addClass("hidden")
    if (data.users.length > 0) {
        $("#usersTable").removeClass("hidden")
        data.users.forEach(function (user) {
            $("#usersTableBody").append('<tr>');
            $("#usersTableBody").append('<td><span class="text-nowrap">' + (user.firstName || '') + '</span></td>');
            $("#usersTableBody").append('<td><span class="text-nowrap">' + (user.lastName || '')+ '</span></td>');
            $("#usersTableBody").append('<td><span class="text-nowrap">' + user.username + '</span></td>');
            $("#usersTableBody").append('<td><span class="text-nowrap">' + (user.email || '') + '</span></td>');
        });

        createPagination(data.pageInfo);
    }

    $("#createUser").modal('hide');
    //$("#filterUsers input").val('');
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