$(document).ready(populateTable());

function populateTable() {
    $("#vulnsTableBody").empty();
    $("#vulnsTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    setTimeout(function() {
        $.get("/api/vulnerabilities", function(data, status) {
            $(".loadingGif").addClass("hidden")
            if (data.length > 0) {
                $("#vulnsTable").removeClass("hidden")
                data.forEach(function (vuln) {
                    $("#vulnsTableBody").append('<tr>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap dot vuln-count-' + vuln.severity + '"</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln.pluginName + '</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln.pluginFamily + '</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln.pluginId + '</span></td>');
                    $("#vulnsTableBody").append('<td><span class="text-nowrap">' + vuln.count + '</span></td>');
                    $("#vulnsTableBody").append('</tr>');
                });
            }
        });
    },
    1000);

    $("#filterVulns").modal('hide');
    $("#filterVulns input").val('');
}