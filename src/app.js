(function(window, undefined) {
    var oLastTagDiv;
    var oTimer;

    $(function() {
        fWindowLoad();
    });


    function fWindowLoad() {
        $('a.tag').mouseenter(fTagMouseEnter)
            .mouseleave(fTagMouseLeave);
        fSuggest();
    }

    function fTagMouseEnter() {
        fHideTipDiv($('a[data-toggle=feedback]'), '007');
        
        var oTagDiv = $(this);
        var sDescrition = oTagDiv.data('des');
        var sId = oTagDiv.data('index');
        var nHeight = oTagDiv.height();
        var nTop = oTagDiv.position().top;

        clearTimeout(oTimer);
        if(oLastTagDiv && oLastTagDiv.get(0) != oTagDiv.get(0)) {
            fHideTipDiv(oLastTagDiv, sId);
        }
        oLastTagDiv = oTagDiv;

        var sPos = (nTop - $(document.body).scrollTop()) * 2 > $(window).height() ? 'top' : 'bottom';

        oTagDiv.popover({
            placement: sPos,
            title: '详情',
            html: true,
            container: document.body,
            content: '<p style="width:400px">' + sDescrition + '</p><div id="temp' + sId + '" style="width:400px;height:400px;">loading...</div>',
            trigger: 'manual'
        });

        var oTipDiv = oTagDiv.data('popover').tip();
        oTipDiv.one('mouseenter', function() {
            clearTimeout(oTimer);
        }).one('mouseleave', function() {
            fHideTipDiv(oTagDiv, sId);
        });

        oTagDiv.popover('show');
        $('#temp' + sId).replaceWith(fBuildCommentBox(sId));
    }

    function fTagMouseLeave() {
        var oTagDiv = $(this);
        oTimer = setTimeout(function() {
            var sId = oTagDiv.data('index');
            fHideTipDiv(oTagDiv, sId);
        }, 250);
    }

    function fHideTipDiv(oTagDiv, sId) {
        // 移动后还是会重新加载啊啊啊
        try {
            var oTipDiv = oTagDiv.data('popover').tip();
            var oIframe = $('iframe', oTipDiv);
            $(document.body).append(oIframe);
            oIframe.hide();
            oTagDiv.popover('hide');
        } catch(e) {};
    }

    function fSuggest() {
        var oTagDiv = $('a[data-toggle=feedback]');
        oTagDiv.popover({
            placement: 'bottom',
            title: '反馈',
            html: true,
            content: '<div id="temp007">loading...</div>',
            trigger: 'click'
        });

        var bShow = true;
        oTagDiv.on('click', function() {
            if(bShow) {
                $('#temp007').replaceWith(fBuildCommentBox('007'));
            } else {
                fHideTipDiv(oTagDiv, '007');
            }
            bShow = !bShow;
        });
    }

    function fBuildCommentBox(sId) {
        var oIframe = $('#iframe' + sId);
        if(oIframe.length != 0) {
            oIframe.show();
            return oIframe.get(0);
        }

        oIframe = document.createElement('IFRAME');
        var sTmpl = [
                '<head></head>',
                '<body>',
                '<style>body{overflow:auto}</style>',
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
                '</script>',
                '</body>'
        ].join('');
        oIframe.id = 'iframe' + sId;
        oIframe.style.display = 'none';
        oIframe.frameborder = 0;
        oIframe.marginwidth = 0;
        oIframe.allowTransparency = true;
        oIframe.marginheight = 0;
        oIframe.style.border = 0;
        oIframe.style.width = '400px';
        oIframe.style.height = '400px';
        document.body.appendChild(oIframe);

        $(oIframe).on('load', function() {
            var oIframeDoc = oIframe.contentDocument || oIframe.contentWindow.document;
            oIframeDoc.write(sTmpl.replace(/\{id\}/g, sId));
            $(this).show();
        });

        return oIframe;
    }

})(window);