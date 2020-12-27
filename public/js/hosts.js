$(document).ready(populateTable());

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