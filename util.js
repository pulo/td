WSUI.Util={};

//计时器组件
WSUI.Util.timer=WSUI.Core.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        this._super(_opt);
        this.set({
            'delay':_opt.delay||30,
            'repeatCount':_opt.repeatCount||0//运行次数，默认为0，无限运行
        });
        this.set({
            'running':false,//当前运行状态
            'currentCount':0// 当前已执行的次数
        });
        this.taskList=[];
        if(this.get('repeatCount')==0){//判断是否为无穷
            this.canRepeat='infinity';
        }else{
            this.canRepeat=this.get('repeatCount');//记录实际的重复数,用于统计
        }
    },
    addEvent:function(fn){//
        //检测是否已经存在
        this.taskList.push(fn);
        //排重
        jQuery.unique(this.taskList);
    },
    removeEvent:function(fn){
        for (i in this.taskList){
            if(this.taskList[i]===fn){
                this.taskList.splice(i,1);
            }
        }
    },
    start:function(){
        var _this=this;
        if(this.get('running'))return false;
        this.set('running',true);
        this.timer=setInterval(function(){
            //记录当前已经执行了几次
            _this.set('currentCount',_this.get('currentCount')+1);
            //执行任务
            for(i in _this.taskList){
                _this.taskList[i]();
            }
            //canRepeat计数器--
            if(typeof(_this.canRepeat)!='string'){
                _this.canRepeat--;
                if(_this.canRepeat==0){
                    _this.reset();
                }
            }
        },this.get('delay'));
    },
    reset:function(){
        clearInterval(this.timer);
        this.canRepeat=this.get('repeatCount');//记录实际的重复数,用于统计
        this.set('running',false);
        this.set('currentCount',0);
    },
    stop:function(){
        clearInterval(this.timer);
        this.set('running',false);
    },
    destroy:function(){
        this._super();
    }
});

////测试timer控件
//var NT=WSUI.Create(WSUI.Util.timer);
//var event1=function(){}
//NT.addEvent(event1);
//NT.addEvent(event1);
//NT.addEvent(event1);
//NT.addEvent(event1);
//NT.addEvent(event1);
//NT.start();
////NT.removeEvent(event1);
//console.log(NT.taskList);

//三角函数
WSUI.Util.Geometry={
    GetAngle:function(t1,t2){//根据2点 获得 两点的角度
        if(((t1[1]-t2[1])==0)&&((t1[0]-t2[0])==0)){
            return false;//如果是同一个点 返回空
        }else{
            return (Math.atan2(t1[1]-t2[1],t2[0]-t1[0])*180/Math.PI+360)% 360;
        }
    },
    GetOffset:function(angle,distance){//根据角度及距离，求出2点的偏差
        //对angle进行上下左右的方向判断，以优化性能
        var _offset=[];
        switch (angle){
            case 0:
                _offset=[distance,0];
                break;
            case 90:
                _offset=[0,-distance];
                break;
            case 180:
                _offset=[-distance,0];
                break;
            case 270:
                _offset=[0,distance];
                break;
            default:
                var _a=angle*Math.PI/360*2;
                _offset=[Math.cos(_a)*distance,-Math.sin(_a)*distance];

        }
        return _offset;
    },
    GetDistance:function(t1,t2){//根据2个坐标 求距离
        return Math.sqrt(Math.pow((t2[1]-t1[1]),2)+Math.pow((t2[0]-t1[0]),2))
    },
    GetCenter:function(o){//求中心  o必须拥有 x y w h 4个属性
        return [o.x+o.w/2,o.y+o.h/2];
    },
    Get_x_y:function(o){//根据中心求xy o必须有: cx,cy
        return [o.cx-o.w/2,o.cy-o.ch/2]
    }
};

//关系函数
$UI.Util.Position={
    Offset : function(tgtA,tgtB){//获得两者的偏移值 A比B
        return {x:tgtA.x-tgtB.x,y:tgtA.y-tgtB.y};
    },
    HitTest:function(tgtA,tgtB){

        var hitStatus=false;
        var _objectTest=function(){
            if((tgtA.x+tgtA.w>tgtB.x)&&(tgtA.x<tgtB.x+tgtB.w)&&(tgtA.y+tgtA.h>tgtB.y)&&(tgtA.y<tgtB.y+tgtB.h)){
                hitStatus=true;
            };
        };
        _objectTest();
        return hitStatus;
    }

};

$UI.Util.Object={
    DeepVal:function(o,deep){
        var _d=deep.split('.');
        var _result;
        var _checkDeep=function(subObj){
            //检测
            if((typeof(subObj[_d[0]])=='object')&&(_d.length>1)){
                var _nextObj=subObj[_d[0]];
                _d.splice(0,1);//每次递归后 删除第一项
                _checkDeep(_nextObj);
            }else{
                _result = subObj[_d[0]];
            }
        };
        _checkDeep(o);
        return _result;
    },
    SetVal:function(o,deep,val){//和上方的代码相呼应
//        var _d=deep.split('.');
//        var _result;
//        var o2=o;
//        for(i in _d){
//            if(typeof(o[_d[i]])!='object'){
//                o[_d[i]]={};
//            }
//
//            o2=o[_d[i]];
//
//        }
//
//        console.log(o);


//        var _pushVal=function(subObj){
//            console.log(subObj);
//            if((!subObj[_d[0]])||(_d.length>1)){//如果子属性不存在，则创建一个
//                subObj[_d[0]]={}
//                _pushVal(subObj[_d[0]]);
//            }else{
//                subObj[_d[0]]=val;
//            }
//        };
//        _pushVal(o);
    },
    //将数组第n项搬到第一个位置，并返回新数组,注：n为顺序、不会更改原数据
    ToFirst:function(arr,index){
        var a = arr.slice(0);
        return a.splice(index,1).concat(a);
    },
    ToLast:function(arr,index){
        var newArray=[].concat(arr);
        var moveItem=newArray[index];
        newArray.splice(index,1);
        newArray.push(moveItem);
        return newArray;
    }
}
//var a={
//    b:{
//        c:1,
//        d:{
//            e:'aaa'
//        }
//    },
//    d:5
//};
//console.log($UI.Util.Object.DeepVal(a,'b.de.e'));
//$UI.Util.Object.SetVal(a,'b.d.e',5);

//console.log(a);
//
//
//var ns=function(obj,val){
//    var a = arguments, o, i = 0, j, d, arg;
//    for (; i < a.length; i++) {
//        o = window;
//        arg = obj;
//        if (arg.indexOf('.')) {
//            d = arg.split('.');
//            for (j = 0; j < d.length; j++) {
//                o[d[j]] = o[d[j]] || {};
//                o = o[d[j]];
//            }
//        } else {
//            o[arg] = o[arg] || {};
//        }
//    }
//}
//
//ns('a.bbb.cccc',12345);