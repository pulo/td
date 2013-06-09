WSUI.Map=WSUI.Core.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        this._super(_opt);
        this.set({
            map:_opt.map
        });
        //创建地图格子
        var cellWidth=30,cellHeight=30;
        for(i in this.get('map')){
            for(j in this.get('map')[i]){
                var left=i*cellWidth;
                var top=j*cellHeight;
                var width=cellWidth;
                var height=cellHeight;
                var dom=jQuery('<div>',{
                    'class':'map_cell',
                    'id':'m_'+i+'_'+j,
                    'style':'left:'+left+'px;top:'+top+'px;width:'+(width-1)+'px;height:'+(height-1)+'px'
                });

                if(this.get('map')[i][j]==1)dom.addClass('start');
                if(this.get('map')[i][j]==2)dom.addClass('end');
                if(this.get('map')[i][j]==3)dom.addClass('block');
                if(this.get('map')[i][j]==4)dom.addClass('tower');
                $("#stage").append(dom);
            }
        }

    },
    //接口
    //输入坐标，获得真实位置
    getPixPosition:function(X,Y){
        var left=X*cellWidth;
        var top=Y*cellHeight;
        return [left,top];
    }
})