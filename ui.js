WSUI.Ui={};

//选塔菜单
WSUI.Ui.TowerMenu=WSUI.Core.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        var _this=this;
        this._super(_opt);
        this.set({
            el:_opt.el
        });
        this.dom=$('<div>',{
            style:'display:none;height:100px;width:100px;background-color:#f00;'

        });

        this.dom.html('<ul class="gun">机枪</ul><ul class="cannon">大炮</ul><ul class="water">水弹</ul><ul class="poison">毒气</ul>');
        $('body').append(this.dom);

        this.dom.on('click','.gun',function(e){
            //先实现建一个塔
            WSUI.MiddleWare.Create('Tower_Gun',{
                x:parseInt(_this.currentHandle.css('left'))+2,//3为修正值
                y:parseInt(_this.currentHandle.css('top'))+2
            });
            _this.dom.hide();
        });
        this.dom.on('click','.cannon',function(){
            alert('cannon');
        });
        this.dom.on('click','.water',function(){
            alert('water');
        });
        this.dom.on('click','.poison',function(){
            alert('poison');
        });
        this.get('el').on('click',function(e){
            _this.currentHandle= $(e.target);//记录当前所展开控件的EL
            _this.dom.show();
            $UI.Util.Position.Snap({
                my:_this.dom,
                of: jQuery(e.target),
                position:'center middle'
            });

            //为所有除了日历以外的元素绑定事件，
            jQuery('body').on('mousedown', function (e) {
                if (jQuery(e.target).closest(_this.dom).length == 0) {
                    _this.dom.hide();
                }
            });
        });


    }

});