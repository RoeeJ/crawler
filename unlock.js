unlock = function() {
    var password = $("input[name='password']").val();
    //if($.trim(password).length != 0) {
        $.ajax({
            url: 'ajax/unlock.php',
            type: 'get',
            data: { 'password': password, 'file': $("input[name='fileId']").val(), 'keep': ($("input[name='keep']").is(':checked')) ? 'true' : 'false' },
            cache: false,
            beforeSend: function() {
                $("#locked_div").html('<img src="img/ajax-loader.gif" alt="loading" />');
            },
            success: function(data) {
                if(data.charAt(0) == 0) {
                    data = data.slice(1);
                    $("#locked_div").html('<button id="locked" onclick=\'openPremOrUnlock();\'>הורדה נעולה</button><p id="error"></p>');
                    $("#error").fadeIn('fast').html(data);
                } else {
                    $("#error").fadeOut('fast');
                    $("#tempAlert").fadeIn();
                    $("#locked_content").slideUp(); 
                    $("#prem_message").slideUp(function() {
                        if($("#isWatchOnline").length > 0) location.reload();
                        $("#dl_section").html(data);
                        $("#download").show();
                        $("#watchOnline").show();
                        var seconds_left = $(data).find('#unlockedTick').attr('alt');
                        days = parseInt(seconds_left / 86400);
                        seconds_left = seconds_left % 86400;
                         
                        hours = parseInt(seconds_left / 3600);
                        seconds_left = seconds_left % 3600;
                          
                        minutes = parseInt(seconds_left / 60);
                        seconds = parseInt(seconds_left % 60);
                        var timeLeft = days + ' ימים, ' + hours + ' שעות, ' + minutes + ' דקות';
                        
                        var dailyVolume = $(data).find('#dailyVolume').val().split('/');
                        var dailyUsage  = dailyVolume[0];
                        var dailyLimit  = dailyVolume[1];
                        
                        $("#bottomLinks").append('<a class="tooltip" title="זמן שנותר: ' + timeLeft + '">[תוקף קוד הגישה]</a><a class="tooltip" title="' + humanFileSize(dailyUsage) + ' מתוך ' + humanFileSize(dailyLimit) + '">[הגבלה יומית]</a>');
                        
                        $('.tooltip').tooltipster();
                    });
                }
            }
        });
    //}
}

cleanPass = function() {
    $.ajax({
        url: 'ajax/unlock.php',
        type: 'get',
        data: { cleanPass: 1 },
        success: function(data) {
            $("#cleanPass").fadeOut();
        }
    });
}

function openPremOrUnlock() {
    if($('#passInput').val() != '') unlock();
    else openAlert('','#premTable','','925px','auto');
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KB','MB','GB','TB','PB','EB','ZB','YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};