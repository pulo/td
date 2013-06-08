WSUI.Util={};

//��ʱ�����
WSUI.Util.timer=WSUI.Core.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        this._super(_opt);
        this.set({
            'delay':_opt.delay||30,
            'repeatCount':_opt.repeatCount||0//���д�����Ĭ��Ϊ0����������
        });
        this.set({
            'running':false,//��ǰ����״̬
            'currentCount':0// ��ǰ��ִ�еĴ���
        });
        this.taskList=[];
        if(this.get('repeatCount')==0){//�ж��Ƿ�Ϊ����
            this.canRepeat='infinity';
        }else{
            this.canRepeat=this.get('repeatCount');//��¼ʵ�ʵ��ظ���,����ͳ��
        }
    },
    addEvent:function(fn){//
        //����Ƿ��Ѿ�����
        this.taskList.push(fn);
        //����
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
            //��¼��ǰ�Ѿ�ִ���˼���
            _this.set('currentCount',_this.get('currentCount')+1);
            //ִ������
            for(i in _this.taskList){
                _this.taskList[i]();
            }
            //canRepeat������--
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
        this.canRepeat=this.get('repeatCount');//��¼ʵ�ʵ��ظ���,����ͳ��
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

////����timer�ؼ�
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

//���Ǻ���
WSUI.Util.Geometry={
    GetAngle:function(t1,t2){//����2�� ��� ����ĽǶ�
        if(((t1[1]-t2[1])==0)&&((t1[0]-t2[0])==0)){
            return false;//�����ͬһ���� ���ؿ�
        }else{
            return (Math.atan2(t1[1]-t2[1],t2[0]-t1[0])*180/Math.PI+360)% 360;
        }
    },
    GetOffset:function(angle,distance){//���ݽǶȼ����룬���2���ƫ��
        //��angle�����������ҵķ����жϣ����Ż�����
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
    GetDistance:function(t1,t2){//����2������ �����
        return Math.sqrt(Math.pow((t2[1]-t1[1]),2)+Math.pow((t2[0]-t1[0]),2))
    },
    GetCenter:function(o){//������  o����ӵ�� x y w h 4������
        return [o.x+o.w/2,o.y+o.h/2];
    },
    Get_x_y:function(o){//����������xy o������: cx,cy
        return [o.cx-o.w/2,o.cy-o.ch/2]
    }
};

//��ϵ����
$UI.Util.Position={
    Offset : function(tgtA,tgtB){//������ߵ�ƫ��ֵ A��B
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
            //���
            if((typeof(subObj[_d[0]])=='object')&&(_d.length>1)){
                var _nextObj=subObj[_d[0]];
                _d.splice(0,1);//ÿ�εݹ�� ɾ����һ��
                _checkDeep(_nextObj);
            }else{
                _result = subObj[_d[0]];
            }
        };
        _checkDeep(o);
        return _result;
    },
    SetVal:function(o,deep,val){//���Ϸ��Ĵ������Ӧ
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
//            if((!subObj[_d[0]])||(_d.length>1)){//��������Բ����ڣ��򴴽�һ��
//                subObj[_d[0]]={}
//                _pushVal(subObj[_d[0]]);
//            }else{
//                subObj[_d[0]]=val;
//            }
//        };
//        _pushVal(o);
    },
    //�������n��ᵽ��һ��λ�ã�������������,ע��nΪ˳�򡢲������ԭ����
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