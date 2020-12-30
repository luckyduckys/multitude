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
    $("#hostsTableBody").empty();
    $("#hostsTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    setTimeout(function() {
        $.get("/api/hosts", function(data, status) {

            $(".loadingGif").addClass("hidden")
            if (data.length > 0) {
                console.log(data);
                $("#hostsTable").removeClass("hidden")
                data.forEach(function (host) {
                    $("#hostsTableBody").append('<tr>');
                    $("#hostsTableBody").append('<td><span class="text-nowrap"><input type="checkbox"/></span>')
                    $("#hostsTableBody").append('<td><span class="text-nowrap">' + (host.fqdn || '') + '</span></td>');
                    $("#hostsTableBody").append('<td><span class="text-nowrap">' + host.ip + '</span></td>');
                    $("#hostsTableBody").append('<td><span class="text-nowrap">' + (host.os || '') + '</span></td>');
                    $("#hostsTableBody").append('<td><span class="text-nowrap">' + new Date(host.lastScan).toLocaleString() + '</span></td>');
                    $("#hostsTableBody").append('</tr>');
                });
            }
        });
    },
    1000);

    $("#filterHosts").modal('hide');
    $("#filterHosts input").val('');
}