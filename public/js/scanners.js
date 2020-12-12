$(document).ready(populateTable());

$('#createNewScannerForm').submit(function (event) {
    event.preventDefault();
    $.ajax({
        url: '/api/scanners',
        type: 'post',
        data: $('#createNewScannerForm').serialize(),
        success: populateTable()
    });
});

function populateTable() {
    $("#scannerTableBody").empty();

    $.get("/api/scanners", function(data, status) {

        if (data) {
            $("#scannerTable").removeClass("hidden");
            data.forEach(function (scanner) {
                $("#scannerTableBody").append('<tr>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.name + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.ip + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.status + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.version + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap">' + scanner.type + '</span></td>');
                $("#scannerTableBody").append('<td><span class="text-nowrap"><button class="btn btn-danger">Delete</button></span></td>');
                $("#scannerTableBody").append('</tr>');
            });
        }
    });

    $("#addNewScanner").modal('hide');
}