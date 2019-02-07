var lastupdate = 0;

function formatTime(time)
{
    return dateFormat(new Date(parseInt(time)*1000), "mmm dS, yyyy, h:MM TT");
};

function click(name)
{
    $.ajax({
        url:"clk",
        data:{'id':name}
    })
};

$.ajax({
    url:"cfg",
    success: function(data) {
        for (var i = 0; i < data.length; i++) {
            var id = data[i][0];
            var name = data[i][1];
            var state = data[i][2];
            var time = data[i][3];
            var li = '<li id="' + id + '" class="door door-' + state + '" data-icon="false">';
            li = li + '<a href="javascript:click(\'' + id + '\');">';
            li = li + '<h3 style="text-transform:capitalize">Currently ' + state + '</h3>';
            li = li + '<img src="img/'+state + '.png" />';
            li = li + '<p style="text-transform:capitalize"><!--' + name + '. -->Updated <span class="time">' + formatTime(time) + '</span></p>';
            li = li + '</a></li>';
            $("#doorlist").append(li);
            //$("#doorlist").listview('refresh');
        }
    }
});

function poll(){
    $.ajax({
        url: "upd",
        data: {'lastupdate': lastupdate },
        success: function(response, status) {
            lastupdate = response.timestamp;
            for (var i = 0; i < response.update.length; i++) {
                var id = response.update[i][0];
                var state = response.update[i][1];
                var time = response.update[i][2];
                $("#" + id + " h3").html('Currently ' + state);
                $("#" + id + " .time").html(formatTime(time));
                $("#" + id  + " img").attr("src", "img/" + state + ".png")
                //$("#doorlist").listview('refresh');
            }
            //$("#Left_Door p").html(JSON.stringify(response.update));
            setTimeout('poll()', 1000);
        },
        // handle error
        error: function(XMLHttpRequest, textStatus, errorThrown){
            // try again in 10 seconds if there was a request error
            setTimeout('poll();', 10000);
        },
        //complete: poll,
        dataType: "json",
        timeout: 30000
    });

    // Reset camera images as well
    $('#cam-dim').attr('src', '/cam-dim.jpg?cb='+Math.random());
    $('#cam-bright').attr('src', '/cam-bright.jpg?cb='+Math.random());
};

$(document).live('pageinit', poll);

