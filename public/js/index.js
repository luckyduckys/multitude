$(document).ready(getCounts());

function getCounts() {
    $(".vulnerability-row").addClass("hidden");
    $(".loadingGif").removeClass("hidden");

    setTimeout(function() {
        $.get('/api/vulnerabilities', function(data, status) {
            $(".loadingGif").addClass("hidden")
            if (data.vulnerability_counts.length > 0) {
                $(".vulnerability-row").removeClass("hidden");
                data.vulnerability_counts.forEach(function(count) {
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
        })
    },
    1000);
}