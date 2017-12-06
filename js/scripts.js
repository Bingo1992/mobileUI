//******************控制不同设备字体大小**************//
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//******************控制不同设备字体大小******结束**************//

;(function($,win,doc,undefined){
    $.extend({
        // 生成弹窗html
        Tiphtml: function(text){
            var html = '<div class="tip-dialog show">\
            <div class="tip-content">\
                <p>'+text+'</p>\
            </div></div>';
            $('body').append(html);
            setTimeout(function() {
                $('.tip-dialog').remove();
            }, 1000);
        },
        //表单验证提示
        isTip: function(text){
           return this.Tiphtml(text);
        },
        //删除遮罩
        confirmDialog: function(option){
            var opt  = {
                text: "确定删除该内容吗？",
                elm: ""//删除的对象元素
            }
            opt = $.extend(opt, option||{});
            var html = '<div class="delete-dialog ui-dialog show">\
                    <div class="dialog-cnt">\
                        <div class="dialog-content">\
                            <p class="center-text">'+opt.text+'</p>\
                        </div>\
                        <div class="two-btn">\
                            <a class="cancel btn-cancel">取消</a>\
                            <a class="confirm btn-theme">删除</a>\
                    </div></div></div>';
            $('body').append(html);
            $('.cancel').click(function(){
                $('.delete-dialog').remove();
            });
            //确定删除
            $('.confirm').click(function(){
                $('.delete-dialog').remove();
                opt.elm.remove();
            });
        }
    });
    $.fn.extend({
        //tabs
        switchTabs: function(option1,option2){
            return this.each(function() {
                var index = $(option1).index($(this));
                $(this).addClass('active').siblings().removeClass('active');
                $(option2).eq(index).addClass('show').siblings(option2).removeClass('show');   
            });
        },
        //垂直居中的遮罩
        showUiDialog: function(option){
            return this.each(function() {
                $(option).addClass('show');
                // $('body').addClass('fixed-body');
                $('.icon-cancel').add('.cancel').click(function() {
                    $(this).parents(option).removeClass('show');
                    // $('body').removeClass('fixed-body');
                });
            });
        },

        hidefixBtmDialog: function(){
            return this.each(function() {
                $('.fixedBottom-dialog').find('.f-dialog-cnt').removeClass('more-top-open').siblings('.ui-dialog').removeClass('show');
            });
        },
        //底部遮罩
        showfixBtmDialog: function(option){
            return this.each(function() {
                $(option).find('.f-dialog-cnt').addClass('more-top-open')
                        .siblings('.ui-dialog').addClass('show');
                $('.ui-dialog').add('.btn-close').click(function(){
                   $(this).hidefixBtmDialog();
                });
            });
        },
        
        
        //排序筛选
        switchSortTabs:function(option1,option2){
            return this.each(function(){
                var $_this = $(this);
                var $_i = $(this).find('i');
                if($_i.hasClass('icon-down')){
                    $_this.switchTabs(option1,option2)
                          .find('i').attr('class','icon-up');
                 
                    $_this.siblings('li').find('i.icon-up').attr('class','icon-down');
                 
                    event.stopPropagation();
                } 
                // 点击排序，筛选的内容
                $(option2).find('li').click(function(){
                    $(this).switchTabs(option1,option2);
                    var value = $(this).html();
                     $_this.find('span').html(value);
                });

                //点击其他地方隐藏遮罩
                $(document).click(function() {
                    $(option1).find('i.icon-up').attr('class','icon-down');
                    $(option2).removeClass('show');
                });   
            });
        }
    });

    //选择遮罩
    function SlideDialog(option){
        var self = this;
        var opt = {
            dialogList : $('.dialog-list'),
            slideElm : $('.slideValue')
        };
        opt = $.extend(opt, option||{});

        var $startList = opt.dialogList.find('.dialog-start-list');
        var $endList = opt.dialogList.find('.dialog-end-list');
        var $returnBack = opt.dialogList.find('.return-back');    
        var slideValue = '';
   
        self.opt = opt;
        self.dialogList = self.opt.dialogList;
        self.slideElm = self.opt.slideElm;
        self.startList = $startList;
        self.endList = $endList;
        self.returnBack = $returnBack;     
        self.slideValue = slideValue;

        self.init();
        self.dialogList.find('ul').css('height',document.documentElement.clientHeight -44 + 'px');
    };
    SlideDialog.prototype.init = function(){
        var self = this;
        self.dialogList.addClass('more-wp-open');
        $('body').addClass('fixed-body');
        //点击左边
        self.startList.delegate('li','click',function(){
            $(this).switchTabs(self.startList.find('li'));
        });
        // 点击右边
        self.endList.delegate('li','click',function(){
            self.startList.find('li').each(function(){
                if($(this).hasClass('active')){
                    self.slideValue += $(this).html();
                }//获取左边选中的值
            });
            if(self.opt.dialogList.hasClass('Procity-list')){
                self.slideValue += ' - ' + $(this).html();
            }else {
                self.slideValue += $(this).html();
            }
            self.slideElm.html(self.slideValue);//span
            if(self.slideElm.html()==""){
               self.slideElm.val(self.slideValue); //input
            }
            self.removeDialog();
        });
        // 返回按钮
        self.returnBack.click(function(){
            self.removeDialog();
        });
    };
    //移除遮罩
    SlideDialog.prototype.removeDialog = function(){
        var self = this;
        self.dialogList.removeClass('more-wp-open');
        $('body').removeClass('fixed-body');
    };
    window['SlideDialog'] = SlideDialog;

    //全选
    function AllCheck(option){
        var allCheck = $('.all-check');
        var allCheckbox = allCheck.find(':checkbox');
        var checkbox = $(option).find(':checkbox');
        
        var flag = 0;
        this.allCheck = allCheck;
        this.allCheckbox = allCheckbox;
        this.checkbox = checkbox;
        this.option = option;
        this.flag = flag;
        this.init();
    }
    AllCheck.prototype.init = function(){
        var self = this;
        //点击全选
        self.allCheck.click(function(){
            var check = self.allCheckbox.prop("checked");
             if(!check){
                self.checkbox.prop("checked",false);
            }else {
                self.checkbox.prop("checked",true);
            }
        });
           
        //点击各checkbox
        self.checkbox.click(function(){
            self.flag = 0;
            self.checkbox.each(function(i){
                var check2 = self.checkbox.eq(i).prop("checked");
                if(!check2){self.flag++;}
            });
            if(self.flag>=1){
                self.allCheckbox.prop("checked",false);
            }else{
                self.allCheckbox.prop("checked",true);
            }
        });
    }
     window['AllCheck'] = AllCheck;

     // 、、选择车型
     function SelectBrand(option){
        var self = this;
        var brandText = null;
        var opt = {
            carList1: $('.car-list1'),
            carList2: $('.car-list2'),
            carList3: $('.car-list3'),
            carDialog: $('.car-dialog')
        };
        self.opt = opt;
        self.carList1 = self.opt.carList1;
        self.carList2 = self.opt.carList2;
        self.carList3 = self.opt.carList3;
        self.carDialog = self.opt.carDialog;
        self.brandText = brandText;
        opt = $.extend(opt,option||{});
        self.init();
     }
     SelectBrand.prototype.init = function() {
        var self = this;
        // 点击选择车型按钮
        self.carList1.click(function(){
            self.carDialog.addClass('show');
            self.carList2.addClass('more-wp-open');
        });
        //点击遮罩第一层
        self.carList2.delegate('li','click',function(){
            self.carList3.addClass('more-wp-open');
            brandText = $(this).find('p').html();
            //返回按钮
            self.carList2.find('.goback').click(function(event) {
                self.carDialog.removeClass('show');
                self.carList2.removeClass('more-wp-open');
            });
        });
        //点击遮罩第二层
        self.carList3.delegate('.brand-info', 'click', function(event) {
            $(this).siblings('.brand-detail').toggleClass('show');
            self.upDown($(this).find('i'));
            //返回按钮
            self.carList3.find('.goback').click(function(event) {
                self.carList3.removeClass('more-wp-open');
            });
        });
        //点击第三层
        self.carList3.delegate('.brand-detail a', 'click', function(event) {
            $('.car-list').removeClass('more-wp-open');
            self.carDialog.removeClass('show');
            brandText += '-' + $(this).parent().siblings('.brand-info').find('a').html() + '-' + $(this).html(); 
            self.carList1.find('input').val(brandText);
        });
        //点击遮罩层
        self.carDialog.click(function(event) {
           $('.car-list').removeClass('more-wp-open');
            self.carDialog.removeClass('show');
        });
     }
     SelectBrand.prototype.upDown = function($elm){
        if ($elm.hasClass('icon-down')) {
            $elm.attr("class", "icon-up");
        } else {
            $elm.attr("class", "icon-down");
        }
     }
    window['SelectBrand'] = SelectBrand;
})(jQuery,window,document);



$(function(){
    // --------form表单----------
    //--日期
    $('.date').bind('input propertychange', function (){
        var dateValue = $(this).find('input').val();
        if(dateValue ==''){
           $(this).removeClass('getDate');
           $(this).find('span').html('请输入时间');
        }else {
            $(this).find('span').html(dateValue);
            $(this).addClass('getDate');
        }
    }); 

});
//input只能输入整数
function onlynum(){
    if ( ! ((event.keyCode >= 48 && event.keyCode <= 57 ) || (event.keyCode >= 96 && event.keyCode <= 105 ) || (event.keyCode == 8 ))){
        event.returnValue = false ;
    } 
}