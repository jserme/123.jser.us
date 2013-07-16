$(function() {
    var w = window;
    //产生一个多说的框

    function buildCommentBox(iframe, id) {
        var tmpl = [
                '<style>body{overflow:scroll}</style>',
                '<div class="ds-thread" data-url="http://123.jser.us" data-thread-key="{id}"></div>',
                '<script type="text/javascript">',
                '    var duoshuoQuery = {short_name:"123jser"};',
                '    (function() {',
                '        var ds = document.createElement("script");',
                '        ds.type = "text/javascript";ds.async = true;',
                '        ds.src = "http://static.duoshuo.com/embed.js";',
                '        ds.charset = "UTF-8";',
                '        (document.getElementsByTagName("head")[0] ',
                '        || document.getElementsByTagName("body")[0]).appendChild(ds);',
                '    })();',
                '</script>'
        ].join('');

        var fd = iframe.contentWindow.document;
        fd.write(tmpl.replace(/\{id\}/g, id));
    }

    //附加到window上给iframe用
    w.buildCommentBox = buildCommentBox;

    //反馈的窗口
    $('a[data-toggle=feedback]').popover({
        placement: 'bottom',
        title: '反馈',
        html: true,
        content: '<iframe border="0" src="about:blank" onload="buildCommentBox(this, \'feedback\')" frameborder="0"  marginwidth="0" allowTransparency="true" marginheight="0"  style="border:0 none;width:400px;height:400px"></iframe>',
        trigger: 'click'
    });

    




    $('body').tooltip({
        selector : 'a[data-toggle=tooltip]'
    });

    //百度统计自定义事件数据
    w._hmt = w._hmt || [];

    //_hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    //category：要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必选。
    //action：用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必选。
    //opt_label：事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。
    //opt_value：事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
});
