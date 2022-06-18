
var urlmain = ""
var vid = ""
var topTenComments = []
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url;
    urlmain = url
    const index = urlmain.indexOf("=")
    if (index == -1) {
        vid = ""
    } else {
        vid = urlmain.substring(index + 1, urlmain.length)
    }
});

$(document).ready(function () {
    $("form").submit(async function (event) {
        event.preventDefault();
        console.log(vid);
        if (vid != "") {
            $("#warning").addClass("d-none");
            $("#form").addClass("d-none");
            $("#middle-data").removeClass("d-none");

            var vi = vid
            var apiKey = "AIzaSyBoyAo4OYTTxQ3PSjsvTf8qmFDB4cHYhUU";
            var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=" + apiKey + "&videoId=" + vi + "&maxResults=200";
            var obj = {}
            await $.get(url, function (data) {
                console.log(data);
                for (var i = 0; i < data.items.length; i++) {
                    obj[data.items[i].snippet.topLevelComment.snippet.authorChannelId.value] = data.items[i].snippet.topLevelComment.snippet.textOriginal;
                }
            })
            json_obj = JSON.stringify(obj)
            // console.log(json_obj);
            const urlview = "http://192.168.0.93:5001/api/sentiment_response"
            $.ajax({
                url: urlview,
                type: 'post',
                contentType: 'application/json',
                success: function (data) {
                    console.log(data);
                    console.log("Posted");
                    console.log(data.result);

                    $("#form-comment").removeClass("d-none");
                    topTenComments = data.top_comment;
                    for (let i = 0; i < topTenComments.length; i++) {
                        $("#drop-down-area").append("<li class='list-group-item text-wrap'>" + topTenComments[i] + "</li>")
                    }

                    document.getElementById("main").innerHTML += data.result.toUpperCase()
                    document.getElementById("main").style.background = "lightgreen"
                    document.getElementById("main").style.fontSize = "24px"

                    $("#middle-data").addClass("d-none");
                    $("#card-body").removeClass("d-none");

                    const datax = data.rating

                    const labels = []
                    const data_value = []

                    for (const [key, value] of Object.entries(datax)) {
                        labels.push(key);
                        data_value.push(value);
                    }

                    const chart_data = {
                        labels: labels,
                        datasets: [{
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(255, 159, 64, 0.6)',
                                'rgba(255, 205, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(153, 102, 255, 0.6)',
                                'rgba(201, 203, 207, 0.6)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                            ],
                            data: data_value,
                        }]
                    };

                    const config = {
                        type: 'bar',
                        data: chart_data,
                        options: {
                            plugins: {
                                legend: {
                                    labels: {
                                        filter: (legendItem, data) => (typeof legendItem.text !== 'undefined')

                                    }
                                    // position: 'right',
                                    // display:'none'
                                }
                            }
                        },
                    };

                    const myChart = new Chart(
                        document.getElementById('myChart'),
                        config
                    );
                },
                data: json_obj
            });
        } else {
            $("#warning").removeClass("d-none");
        }
    })
    $("#dropdownMenuButton").click(function () {
        if ($("#dropdownMenuButton").html() != "Hide Comments") {
            $("#drop-down-area").removeClass("d-none");
            $("#dropdownMenuButton").html("Hide Comments")
        } else {
            $("#drop-down-area").addClass("d-none");
            $("#dropdownMenuButton").html("Show Top Comments")
        }
    })
})

