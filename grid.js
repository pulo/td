//网格系统
WSUI.Grid={
    debug:'T',
    W:32,
    H:16,
    cw:30,// 单个单元格的宽度
    ch:30,// 单个单元格的高度
    cellArray:[],
    list:{},

    Reg:function(o){//与网格建立关联
        var _this=this;
        this.list[o.get('id')]=o;
        //注册的物体，监听 移动 销毁 等事件
//        jQuery(o).on('after_move',function(){
//            //重新计算所占据的格子
//            _this.GridUsed(this);
//        });
        jQuery(o).on('before_destroy',function(){
            //消除
            _this.Unreg(this);
        });
        //o.gridMap=[];
    },
    Unreg:function(o){
        delete this.list[o.get('id')];
    },
    PushItem:function(X,Y,o){//对象注册到网格
        //注册到网格的物体，首先进行坐标检测
        this.cellArray[X][Y].push(o);


    },
    ItemLoc:function(x,y){ //根据对象的xy求出XY
        var X,Y;
        X=parseInt(x / this.cw);
        Y=parseInt(y / this.ch);
        return [X,Y];
    },
    GridUsed:function(o){//根据对象的长宽 XY 求出所占的单元格
        var gridMap=[];
        var itemXY_1=this.ItemLoc(o.get('x'),o.get('y'));//求左上角XY
        var itemXY_2=this.ItemLoc(o.get('x')+o.get('w'),o.get('y')+o.get('h'));//求右下角XY
        if(itemXY_1[0]<0)itemXY_1[0]=0;
        if(itemXY_1[1]<0)itemXY_1[1]=0;

        if(itemXY_2[0]>(this.W-1))itemXY_2[0]=this.W-1;//边界检测
        if(itemXY_2[1]>(this.H-1))itemXY_2[1]=this.H-1;//边界检测

        for(var i=itemXY_1[0];i<=itemXY_2[0];i++){
            for(var j=itemXY_1[1];j<=itemXY_2[1];j++){
                gridMap.push([i,j]);
            }
        }
        //o.gridMap=gridMap;//为对象 增加gridMap属性，用于做碰撞测试
        return gridMap;
    },
    HaveObj:function(X,Y){//获取单元格内拥有的对象LIST
        return this.cellArray[X][Y];
    },
    _init:function(){//显示网格
        var _this=this;
        for(var X=0;X<this.W;X++){ //创造一个二位数组， 记录所有的单元格，每个单元格为一个数组对象，用于存放ITEM 注:要把整个对象丢进去 光1个ID反找起来麻烦
            this.cellArray[X]=[];
            for(var Y=0;Y<this.H;Y++){
                this.cellArray[X][Y]=[];
                if(this.debug=="T"){ //开发模式，在HTML里画出所有的CELL
                    var id="g_"+X+"_"+Y;
                    var left=X*this.cw;
                    var top=Y*this.ch;
                    var width=this.cw;
                    var height=this.ch;
                    var dom=jQuery('<div>',{
                        'id':id,
                        'class':'grid_cell',
                        'style':'left:'+left+'px;top:'+top+'px;width:'+(width-1)+'px;height:'+(height-1)+'px;display:none'
                    });
                    $("#stage").append(dom);
                    //this.showCell(X,Y);
                    $("#g_"+X+"_"+Y).show();
                }
            }
        };
        //创建一个Timer

        //var RenderTimer=WSUI.Create(WSUI.Util.timer);


        //此计时器用于检查所有的表格里的对象坐标 是否已经离开表格
        GameTimer.addEvent(function(){
            //清除已经移除网格的物体
            $.each(_this.cellArray,function(i){
                $.each(this,function(j){
                    if(this.length>0)this.length=0;
                });
            });

            $.each(_this.list,function(){//检查绑定物体的列表，获得网格坐标 并在 各个网格坐标里 注册物体
                var _i=this; //List里的item
                var objLocMap=_this.GridUsed(this);//获得物体所占的全部坐标
                $.each(objLocMap,function(){ //在物体所占的坐标里 把对象加进去
                    _this.PushItem(this[0],this[1],_i);
                })
            });
        });

        if(this.debug=="T"){ //开发者模式 帮助显示所有cell项所持有的ITEMID
            this.bakHtmlTxt={};//备份CELL的单元格HTML 避免重复渲染
            GameTimer.addEvent(function(){//定时 直接跟踪cellArray
                $.each(_this.cellArray,function(i){
                    $.each(this,function(j){
                        if(this.toString()!=_this.bakHtmlTxt["#g_"+i+"_"+j]){
                            var itemList="";
                            $.each(this,function(){
                                itemList+=this.id.substr(0,5)+"<br />";
                            });
                            $("#g_"+i+"_"+j).html(itemList);
                        }
                        _this.bakHtmlTxt["#g_"+i+"_"+j]=this.toString();//备份CELL的单元格HTML 避免重复渲染
                    });
                });
            })
        }
    }

}

$(document).ready(function(){WSUI.Grid._init();})