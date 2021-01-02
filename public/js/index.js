$(document).ready(getCounts());

function getCounts() {
    $(".loadingGif").removeClass("hidden");

    $.get('/api/chart/totals', function(data, status) {
        $(".loadingGif").addClass("hidden")
        if (data.length > 0) {
            $(".vulnerability-row").removeClass("hidden");
            data.forEach(function(count) {
                switch (count._id) {
                    case 4:
                        $('#totalCricitalCount').text(count.severityCount);
                        break;
                    
                    case 3:
                        $('#totalHighCount').text(count.severityCount);
                        break;
                    
                    case 2:
                        $('#totalMediumCount').text(count.severityCount);
                        break;
                    
                    case 1:
                        $('#totalLowCount').text(count.severityCount);
                        break;
                }
            })
        }
    });
}