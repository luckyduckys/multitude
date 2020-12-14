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

function populateTable() {
    $("#scannerTableBody").empty();
    $("#scannerTable").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    setTimeout(function() {
        $.get("/api/scanners", function(data, status) {

            $(".loadingGif").addClass("hidden")
            if (data.length > 0) {
                $("#scannerTable").removeClass("hidden")
                data.forEach(function (scanner) {
                    $("#scannerTableBody").append('<tr>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.name + '</span></td>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.ip + '</span></td>');
                    $("#scannerTableBody").append('<td><span class="text-nowrap">' + (scanner.status || '')+ '</span></td>');
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