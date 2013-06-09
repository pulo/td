WSUI.Ui={};

//选塔菜单
WSUI.Ui.TowerMenu=WSUI.Core.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        this._super(_opt);
        this.set({
            el:_opt.el
        });
        this.get('el').on('click',function(e){
            //先实现建一个塔
            WSUI.MiddleWare.Create('Tower_Gun',{
                x:parseInt($(e.target).css('left'))+2,//3为修正值
                y:parseInt($(e.target).css('top'))+2
            });
        })

    }
})
