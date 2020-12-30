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
    $("#vulnsTableBody").empty();
    $("#vulnsTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    setTimeout(function() {
        $.get("/api/vulnerabilities", function(data, status) {
            $(".loadingGif").addClass("hidden")
            if (data.vulnerabilities.length > 0) {
                $("#vulnsTable").removeClass("hidden");
                data.vulnerabilities.forEach(function (vuln) {
                    $("#vulnsTableBody").append('<tr>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap dot vuln-count-' + vuln.severity + '"</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln.pluginName + '</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln.pluginFamily + '</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln._id + '</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln.instanceCount + '</span></td>');
                    $("#vulnsTableBody").append('</tr>');
                });
            }
        });
    },
    1000);

    $("#filterVulns").modal('hide');
    $("#filterVulns input").val('');
}