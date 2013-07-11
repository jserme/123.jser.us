$(function() {
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

    window.buildCommentBox = buildCommentBox;

    $('body').tooltip({
        selector: "a[data-toggle=tooltip]"
    });

    $('a[data-toggle=feedback]').popover({
        placement: 'bottom',
        title: '反馈',
        html: true,
        content: '<iframe border="0" src="about:blank" onload="buildCommentBox(this, \'feedback\')" frameborder="0"  marginwidth="0" allowTransparency="true" marginheight="0"  style="border:0 none;width:400px;height:400px"></iframe>',
        trigger: 'click'
    });
});
